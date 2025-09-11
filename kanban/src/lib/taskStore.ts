"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, Status } from "./types";
import { sampleTasks } from "./sample";


function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type Filters = { text: string; assignee: string; tag: string };
type SortKey = "manual" | "created" | "due" | "priority" | "title";
type SortDir = "asc" | "desc";
type SortState = { key: SortKey; dir: SortDir };

const prioRank = { high: 3, medium: 2, low: 1 } as const;

function cmpForSort(sort: SortState) {
  return (a: Task, b: Task) => {
    let res = 0;
    switch (sort.key) {
      case "created":
        res = a.createdAt - b.createdAt;
        break;
      case "due": {
        const ah = !!a.dueDate,
          bh = !!b.dueDate;
        if (ah && !bh) res = -1;
        else if (!ah && bh) res = 1;
        else if (!ah && !bh) res = 0;
        else res = Date.parse(a.dueDate!) - Date.parse(b.dueDate!);
        break;
      }
      case "priority": {
        const ar = a.priority ? prioRank[a.priority] : 0;
        const br = b.priority ? prioRank[b.priority] : 0;
        res = ar - br;
        break;
      }
      case "title":
        res = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
        break;
      case "manual":
      default:
        res = 0;
    }
    return sort.dir === "asc" ? res : -res;
  };
}

function ensureManualBaseline(list: Task[], sort: SortState): Task[] {
  if (sort.key === "manual") return list;

  const cmp = cmpForSort(sort);
  const scheduled = list.filter((t) => t.status === "scheduled").slice().sort(cmp);
  const inprog = list.filter((t) => t.status === "in-progress").slice().sort(cmp);
  const done = list.filter((t) => t.status === "done").slice().sort(cmp);

  return [...scheduled, ...inprog, ...done];
}


type TaskState = {
  tasks: Task[];
  filters: Filters;
  sort: SortState;

  _hasHydrated: boolean;
  setHasHydrated: (b: boolean) => void;

  createTask: (t: Omit<Task, "id" | "createdAt">) => string;
  updateTask: (id: string, delta: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;

  reorderWithinStatus: (activeId: string, overId: string) => void;
  moveToStatusAtIndex: (id: string, status: Status, index?: number) => void;

  setFilters: (f: Partial<Filters>) => void;
  setSort: (s: Partial<SortState>) => void;
  resetToSample: () => void;

  clearAll: () => void;

  selectionMode: boolean;
  selected: Record<string, true>;
  isSelected: (id: string) => boolean;
  selectedCount: () => number;
  toggleSelectionMode: (on?: boolean) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  selectAll: (scope?: Status | "visible" | "all", visibleIds?: string[]) => void;
  bulkDelete: () => void;
  bulkMove: (status: Status) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      resetToSample: () =>
        set({ tasks: sampleTasks, filters: { text: "", assignee: "", tag: "" }, sort: { key: "created", dir: "desc" } }),      
      filters: { text: "", assignee: "", tag: "" },
      sort: { key: "created", dir: "desc" },

      _hasHydrated: false,
      setHasHydrated: (b) => set({ _hasHydrated: b }),

      createTask: (t) => {
        const id = genId();
        const newTask: Task = { id, createdAt: Date.now(), ...t };
        set({ tasks: [newTask, ...get().tasks] });
        return id;
      },

      updateTask: (id, delta) =>
        set({
          tasks: get().tasks.map((x) => (x.id === id ? { ...x, ...delta } : x)),
        }),

      deleteTask: (id) =>
        set({
          tasks: get().tasks.filter((x) => x.id !== id),
        }),

      moveTask: (id, status) =>
        set({
          tasks: get().tasks.map((x) => (x.id === id ? { ...x, status } : x)),
        }),

      reorderWithinStatus: (activeId, overId) =>
        set((state) => {
          let base = state.tasks.slice();
          if (state.sort.key !== "manual") {
            base = ensureManualBaseline(base, state.sort);
          }

          const active = base.find((t) => t.id === activeId);
          const over = base.find((t) => t.id === overId);
          if (!active || !over) return {};

          const status = active.status;
          if (over.status !== status) return {};

          const group = base.filter((t) => t.status === status);
          const ids = group.map((t) => t.id);
          const from = ids.indexOf(activeId);
          const to = ids.indexOf(overId);
          if (from < 0 || to < 0 || from === to) {
            return state.sort.key === "manual"
              ? {}
              : { tasks: base, sort: { key: "manual", dir: "asc" } };
          }

          const newIds = arrayMove(ids, from, to);
          const byId = new Map(base.map((t) => [t.id, t] as const));
          let gi = 0;
          const newTasks = base.map((t) =>
            t.status !== status ? t : byId.get(newIds[gi++])!
          );

          return { tasks: newTasks, sort: { key: "manual", dir: "asc" } };
        }),

      moveToStatusAtIndex: (id, status, index) =>
        set(() => {
          const list = get().tasks.slice();
          const fromIdx = list.findIndex((t) => t.id === id);
          if (fromIdx === -1) return { tasks: list };

          const task = { ...list[fromIdx], status };
          list.splice(fromIdx, 1);

          const indices = list
            .map((t, idx) => ({ t, idx }))
            .filter((x) => x.t.status === status)
            .map((x) => x.idx);

          let insertAt: number;
          if (indices.length === 0) insertAt = list.length;
          else if (index === undefined || index >= indices.length)
            insertAt = indices[indices.length - 1] + 1;
          else if (index < 0) insertAt = indices[0];
          else insertAt = indices[index];

          list.splice(insertAt, 0, task);
          return { tasks: list, sort: { key: "manual", dir: "asc" } };
        }),

      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),

      setSort: (s) =>
        set(({ sort }) => ({
          sort: { ...sort, ...s },
        })),

      clearAll: () =>
        set({ tasks: [], filters: { text: "", assignee: "", tag: "" } }),

      selectionMode: false,
      selected: {},
      isSelected: (id) => !!get().selected[id],
      selectedCount: () => Object.keys(get().selected).length,

      toggleSelectionMode: (on) =>
        set((s) => ({
          selectionMode: on ?? !s.selectionMode,
          selected: on === false ? {} : s.selected,
        })),

      toggleSelect: (id) =>
        set((s) => {
          const next = { ...s.selected };
          if (next[id]) delete next[id];
          else next[id] = true;
          return { selected: next };
        }),

      clearSelection: () => set({ selected: {} }),

      selectAll: (scope = "all", visibleIds) =>
        set((s) => {
          let ids: string[] = [];
          if (scope === "visible" && Array.isArray(visibleIds)) {
            ids = visibleIds;
          } else if (scope === "all") {
            ids = s.tasks.map((t) => t.id);
          } else {
            ids = s.tasks.filter((t) => t.status === scope).map((t) => t.id);
          }
          const next: Record<string, true> = {};
          ids.forEach((id) => {
            next[id] = true;
          });
          return { selected: next };
        }),

      bulkDelete: () =>
        set((s) => {
          const sel = s.selected;
          if (!Object.keys(sel).length) return {};
          const tasks = s.tasks.filter((t) => !sel[t.id]);
          return { tasks, selected: {}, selectionMode: false };
        }),

      bulkMove: (status) =>
        set((s) => {
          const sel = s.selected;
          if (!Object.keys(sel).length) return {};
          const tasks = s.tasks.map((t) => (sel[t.id] ? { ...t, status } : t));
          return {
            tasks,
            selected: {},
            selectionMode: false,
            sort: { key: "manual", dir: "asc" },
          };
        }),
    }),
    {
      name: "kanban-store",
      partialize: (s) => ({ tasks: s.tasks, filters: s.filters, sort: s.sort }),
    }
  )
);

if (typeof window !== "undefined") {
  type WithPersist<T> = T & {
    persist?: {
      onFinishHydration?: (cb: () => void) => void;
    };
  };
  const store = useTaskStore as WithPersist<typeof useTaskStore>;

  store.persist?.onFinishHydration?.(() => {
    const state = useTaskStore.getState();
    if (!state.tasks || state.tasks.length === 0) {
      useTaskStore.setState({ tasks: sampleTasks });
    }
    useTaskStore.setState({ _hasHydrated: true });
  });
}

export function useFilteredTasks() {
  const { tasks, filters, sort } = useTaskStore();
  const { text, assignee, tag } = filters;

  const q = text.trim().toLowerCase();
  const filtered = tasks.filter((t) => {
    const textOk =
      !q || (t.title + " " + t.description).toLowerCase().includes(q);
    const assigneeOk = !assignee || t.assignee === assignee;
    const tagOk = !tag || t.tags.includes(tag);
    return textOk && assigneeOk && tagOk;
  });

  if (sort.key === "manual") return filtered;
  return filtered.slice().sort(cmpForSort(sort));
}
