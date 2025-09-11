import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { useTaskStore, useFilteredTasks } from "./taskStore";
import type { Task } from "./types";

const t = (id: string, title: string, due: string | undefined, prio: Task["priority"]) =>
  ({ id, title, description: "", assignee: "A", tags: [], status: "scheduled", createdAt: 0, dueDate: due, priority: prio } as Task);

function Probe() {
  const items = useFilteredTasks();
  return <ul>{items.map(i => <li key={i.id}>{i.id}</li>)}</ul>;
}
const ids = () => Array.from(screen.getAllByRole("listitem")).map(li => li.textContent);

beforeEach(() => {
  (window.localStorage as any).clear?.();
  useTaskStore.setState({
    tasks: [
      t("a", "Alpha", "2024-01-20T00:00:00Z", "low"),
      t("b", "beta", undefined, "high"),
      t("c", "Gamma", "2024-01-05T00:00:00Z", "medium"),
      t("d", "delta", "2024-02-10T00:00:00Z", "high"),
    ],
    filters: { text: "", assignee: "", tag: "" },
    sort: { key: "manual", dir: "asc" },
  } as any);
});

describe("useFilteredTasks sorting", () => {
  it("sorts by due asc (undefined due dates last)", () => {
    render(<Probe />);
    act(() => useTaskStore.setState({ sort: { key: "due", dir: "asc" } as any }));
    expect(ids()).toEqual(["c", "a", "d", "b"]);
  });

  it("sorts by priority desc (high>medium>low)", () => {
    render(<Probe />);
    act(() => useTaskStore.setState({ sort: { key: "priority", dir: "desc" } as any }));
    expect(ids()).toEqual(["b", "d", "c", "a"]);
  });

  it("sorts by title asc using localeCompare (case-insensitive)", () => {
    render(<Probe />);
    act(() => useTaskStore.setState({ sort: { key: "title", dir: "asc" } as any }));
    expect(ids()).toEqual(["a", "b", "d", "c"]);
  });
});
