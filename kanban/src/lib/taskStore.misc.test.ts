import { beforeEach, describe, expect, it } from "vitest";
import { useTaskStore } from "./taskStore";
import type { Task, Status } from "./types";

const T = (id: string, status: Status): Task => ({
  id, title: id, description: "", status, assignee: "A", tags: [], createdAt: 0,
});

beforeEach(() => {
  (window.localStorage as any).clear?.();
  useTaskStore.setState({
    tasks: [],
    filters: { text: "", assignee: "", tag: "" },
    sort: { key: "manual", dir: "asc" },
  } as any);
});

describe("misc store helpers", () => {
  it("setFilters merges fields", () => {
    const s = useTaskStore.getState();
    s.setFilters({ text: "foo" });
    expect(useTaskStore.getState().filters).toEqual({ text: "foo", assignee: "", tag: "" });
    s.setFilters({ assignee: "A" });
    expect(useTaskStore.getState().filters).toEqual({ text: "foo", assignee: "A", tag: "" });
  });

  it("moveTask updates status", () => {
    useTaskStore.setState({ tasks: [T("x", "scheduled")] } as any);
    useTaskStore.getState().moveTask("x", "in-progress");
    expect(useTaskStore.getState().tasks[0].status).toBe("in-progress");
  });

  it("clearAll empties tasks and resets filters", () => {
    useTaskStore.setState({
      tasks: [T("a", "scheduled")],
      filters: { text: "q", assignee: "A", tag: "t" },
    } as any);
    useTaskStore.getState().clearAll();
    expect(useTaskStore.getState().tasks).toHaveLength(0);
    expect(useTaskStore.getState().filters).toEqual({ text: "", assignee: "", tag: "" });
  });
});
