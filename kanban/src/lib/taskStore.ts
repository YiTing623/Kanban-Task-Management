"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Status } from "./types";
import { sampleTasks } from "./sample";

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type Filters = { text: string; assignee: string; tag: string };

type TaskState = {
  tasks: Task[];
  filters: Filters;

  _hasHydrated: boolean;
  setHasHydrated: (b: boolean) => void;

  createTask: (t: Omit<Task, "id" | "createdAt">) => string;
  updateTask: (id: string, delta: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;

  setFilters: (f: Partial<Filters>) => void;
  clearAll: () => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: { text: "", assignee: "", tag: "" },

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

      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),

      clearAll: () =>
        set({ tasks: [], filters: { text: "", assignee: "", tag: "" } }),
    }),
    {
      name: "kanban-store",
      partialize: (s) => ({ tasks: s.tasks, filters: s.filters }),

    }
  )
);

if (typeof window !== "undefined") {
  (useTaskStore as any)?.persist?.onFinishHydration?.(() => {
    const state = useTaskStore.getState();

    if (!state.tasks || state.tasks.length === 0) {
      useTaskStore.setState({ tasks: sampleTasks });
    }

    useTaskStore.setState({ _hasHydrated: true });
  });
}

export function useFilteredTasks() {
  const { tasks, filters } = useTaskStore();
  const { text, assignee, tag } = filters;

  const q = text.trim().toLowerCase();
  return tasks.filter((t) => {
    const textOk =
      !q || (t.title + " " + t.description).toLowerCase().includes(q);
    const assigneeOk = !assignee || t.assignee === assignee;
    const tagOk = !tag || t.tags.includes(tag);
    return textOk && assigneeOk && tagOk;
  });
}
