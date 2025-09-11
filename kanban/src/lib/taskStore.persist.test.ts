import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "./taskStore";

beforeEach(() => {
  (window.localStorage as any).clear?.();
  useTaskStore.setState({
    tasks: [],
    filters: { text: "", assignee: "", tag: "" },
    sort: { key: "manual", dir: "asc" },
  } as any);
});

it("persists tasks & filters to localStorage", () => {
  const id = useTaskStore.getState().createTask({
    title: "X", description: "d", assignee: "A", status: "scheduled", tags: [],
    priority: "medium",
  });
  useTaskStore.getState().setFilters({ text: "x" });

  const raw = window.localStorage.getItem("kanban-store");
  expect(raw).toBeTruthy();

  const parsed = JSON.parse(raw!);
  expect(parsed.state.tasks.find((t: any) => t.id === id)).toBeTruthy();
  expect(parsed.state.filters.text).toBe("x");
});
