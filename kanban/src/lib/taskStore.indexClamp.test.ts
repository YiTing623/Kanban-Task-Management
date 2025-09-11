import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "./taskStore";
import type { Task, Status } from "./types";

const T = (id: string, status: Status): Task => ({
  id, title: id, description: "", status, assignee: "A", tags: [], createdAt: 0,
});

beforeEach(() => {
  (window.localStorage as any).clear?.();
  useTaskStore.setState({
    tasks: [T("x","done"), T("y","done"), T("a","scheduled"), T("b","scheduled")],
    filters: { text: "", assignee: "", tag: "" },
    sort: { key: "manual", dir: "asc" },
  } as any);
});

it("clamps negative index to 0 when moving across columns", () => {
  useTaskStore.getState().moveToStatusAtIndex?.("b", "done", -123);
  const done = useTaskStore.getState().tasks.filter(t=>t.status==="done").map(t=>t.id);
  expect(done).toEqual(["b", "x", "y"]);
});
