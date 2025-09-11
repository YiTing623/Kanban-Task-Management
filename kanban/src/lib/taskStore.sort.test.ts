import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "./taskStore";
import type { Task, Status } from "./types";

const T = (
  id: string,
  status: Status,
  createdAt: number,
  extra: Partial<Task> = {},
): Task => ({
  id,
  title: id,
  description: "",
  status,
  assignee: "A",
  tags: [],
  createdAt,
  ...extra,
});

function seed(tasks: Task[], sort: any = { key: "created", dir: "desc" }) {
  useTaskStore.setState({
    tasks,
    filters: { text: "", assignee: "", tag: "" },
    sort,
  } as any);
}

function colIds(status: Status) {
  const tasks = useTaskStore.getState().tasks;
  return tasks.filter((t) => t.status === status).map((t) => t.id);
}

beforeEach(() => {
  (window.localStorage as any).clear?.();
  seed([]);
});

describe("first-drag baseline & reordering", () => {
  it("freezes visible order on first drag and reorders within the status (up & down)", () => {
    seed(
      [
        T("s1", "scheduled", 1),
        T("p1", "in-progress", 1),
        T("s2", "scheduled", 2),
        T("p2", "in-progress", 2),
        T("s3", "scheduled", 3),
        T("p3", "in-progress", 3),
      ],
      { key: "created", dir: "desc" }
    );

    const baseline = ["s3", "s2", "s1"];

    useTaskStore.getState().reorderWithinStatus?.("s1", "s3");

    const after1 = colIds("scheduled");
    expect(new Set(after1)).toEqual(new Set(baseline));
    expect(after1.indexOf("s1")).toBe(baseline.indexOf("s3"));

    expect(colIds("in-progress")).toEqual(["p3", "p2", "p1"]);


    useTaskStore.getState().reorderWithinStatus?.("s3", "s1");
    const after2 = colIds("scheduled");
    expect(after2.indexOf("s3")).toBe(0);


    expect(useTaskStore.getState().sort.key).toBe("manual");
  });

  it("dropping into a different column inserts at an index and switches to manual", () => {

    seed(
      [T("a", "scheduled", 1), T("b", "scheduled", 2), T("x", "in-progress", 5), T("y", "in-progress", 4)],
      { key: "created", dir: "desc" }
    );

    useTaskStore.getState().moveToStatusAtIndex?.("a", "in-progress", 1);
    expect(colIds("scheduled")).toEqual(["b"]);
    expect(colIds("in-progress")).toEqual(["x", "a", "y"]);
    expect(useTaskStore.getState().sort.key).toBe("manual");
  });

  it("moveToStatusAtIndex() with a large index appends to end", () => {
    seed([T("a", "scheduled", 1), T("b", "scheduled", 2), T("x", "done", 9)], { key: "created", dir: "desc" });
    useTaskStore.getState().moveToStatusAtIndex?.("a", "done", Number.MAX_SAFE_INTEGER);
    expect(colIds("done")).toEqual(["x", "a"]);
  });
});
