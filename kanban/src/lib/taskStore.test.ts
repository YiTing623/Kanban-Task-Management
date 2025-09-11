import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "./taskStore";
import type { Task } from "./types";

function seed(tasks: Task[]) {
  useTaskStore.setState({
    tasks,
    filters: { text: "", assignee: "", tag: "" },
    sort: { key: "manual", dir: "asc" },
  } as any);
}

const t = (id: string, status: Task["status"], title = id): Task => ({
  id, title, description: "", status, assignee: "A", tags: [], createdAt: 0,
});

beforeEach(() => {
  seed([]);
  window.localStorage.clear();
});

describe("taskStore CRUD & moves", () => {
  it("creates a task", () => {
    const id = useTaskStore.getState().createTask({
      title: "X", description: "d", status: "scheduled", assignee: "A", tags: [],
    });
    const { tasks } = useTaskStore.getState();
    expect(tasks.find((x) => x.id === id)).toBeTruthy();
  });

  it("updates and deletes", () => {
    seed([t("1","scheduled")]);
    useTaskStore.getState().updateTask("1", { title: "new" });
    expect(useTaskStore.getState().tasks[0].title).toBe("new");
    useTaskStore.getState().deleteTask("1");
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it("moves to another status at index", () => {
    seed([t("1","scheduled"), t("2","in-progress"), t("3","in-progress")]);
    useTaskStore.getState().moveToStatusAtIndex?.("1", "in-progress", 1);
    const tasks = useTaskStore.getState().tasks;
    const inprog = tasks.filter(x=>x.status==="in-progress").map(x=>x.id);
    expect(inprog).toEqual(["2","1","3"]);
  });

  it("reorders within same status up and down", () => {
    seed([t("a","scheduled"), t("b","scheduled"), t("c","scheduled")]);
    useTaskStore.getState().reorderWithinStatus?.("a","c");
    expect(useTaskStore.getState().tasks.map(x=>x.id)).toEqual(["b","c","a"]);
    useTaskStore.getState().reorderWithinStatus?.("c","b");
    expect(useTaskStore.getState().tasks.map(x=>x.id)).toEqual(["c","b","a"]);
  });
});
