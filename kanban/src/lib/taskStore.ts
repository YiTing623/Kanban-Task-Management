"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { Task, Status } from "./types";
import { sampleTasks } from "./sample";

type Filters = { text: string; assignee: string; tag: string };

type TaskState = {
  tasks: Task[];
  filters: Filters;

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
      tasks: sampleTasks,
      filters: { text: "", assignee: "", tag: "" },

      createTask: (t) => {
        const id = uuid();
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
