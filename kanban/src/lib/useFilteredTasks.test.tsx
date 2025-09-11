import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { useTaskStore, useFilteredTasks } from "./taskStore";
import type { Task } from "./types";

function Probe() {
  const items = useFilteredTasks();
  return (
    <ul data-testid="list">
      {items.map((t) => (
        <li key={t.id}>{t.id}</li>
      ))}
    </ul>
  );
}

const readIds = () =>
  Array.from(screen.getAllByRole("listitem")).map((li) => li.textContent);

const t = (id: string, title: string, desc: string, assignee: string, tags: string[], status: Task["status"]): Task => ({
  id,
  title,
  description: desc,
  assignee,
  tags,
  status,
  priority: "medium",
  createdAt: 0,
});

beforeEach(() => {
  (window.localStorage as any).clear?.();
  useTaskStore.setState({
    tasks: [
      t("a", "Setup project", "init repo & CI", "Alex", ["devops", "infra"], "scheduled"),
      t("b", "Design UI", "cards & columns", "Bea", ["design", "ux"], "scheduled"),
      t("c", "Implement drag", "dnd-kit", "Alex", ["frontend"], "in-progress"),
      t("d", "Docs", "README + testing section", "Dana", ["docs"], "done"),
    ],
    filters: { text: "", assignee: "", tag: "" },
    sort: { key: "manual", dir: "asc" },
  } as any);
});

describe("useFilteredTasks", () => {
  it("returns all tasks when no filters set", () => {
    render(<Probe />);
    expect(readIds()).toEqual(["a", "b", "c", "d"]);
  });

  it("filters by text across title + description (case-insensitive)", () => {
    render(<Probe />);
    act(() => useTaskStore.getState().setFilters({ text: "drag" }));
    expect(readIds()).toEqual(["c"]);

    act(() => useTaskStore.getState().setFilters({ text: "design" }));
    expect(readIds()).toEqual(["b"]);

    act(() => useTaskStore.getState().setFilters({ text: "README" }));
    expect(readIds()).toEqual(["d"]);
  });

  it("filters by assignee", () => {
    render(<Probe />);
    act(() => useTaskStore.getState().setFilters({ assignee: "Alex" }));
    expect(readIds()).toEqual(["a", "c"]);

    act(() => useTaskStore.getState().setFilters({ assignee: "Bea" }));
    expect(readIds()).toEqual(["b"]);
  });

  it("filters by tag", () => {
    render(<Probe />);
    act(() => useTaskStore.getState().setFilters({ tag: "docs" }));
    expect(readIds()).toEqual(["d"]);

    act(() => useTaskStore.getState().setFilters({ tag: "frontend" }));
    expect(readIds()).toEqual(["c"]);
  });

  it("combines filters (text + assignee + tag)", () => {
    render(<Probe />);
    act(() =>
      useTaskStore.getState().setFilters({
        text: "design",
        assignee: "Bea",
        tag: "ux",
      }),
    );
    expect(readIds()).toEqual(["b"]);
  });

  it("clears filters", () => {
    render(<Probe />);
    act(() => useTaskStore.getState().setFilters({ assignee: "Dana" }));
    expect(readIds()).toEqual(["d"]);

    act(() =>
      useTaskStore.getState().setFilters({ text: "", assignee: "", tag: "" }),
    );
    expect(readIds()).toEqual(["a", "b", "c", "d"]);
  });
});
