"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useFilteredTasks, useTaskStore } from "@/lib/taskStore";
import FiltersBar from "@/components/FiltersBar";
import EmptyState from "@/components/EmptyState";
import TaskFormModal from "@/components/TaskFormModal";
import { formatDate } from "@/lib/date";
import { highlight } from "@/lib/highlight";
import type { Task } from "@/lib/types";

export default function TasksListPage() {
  const tasks = useFilteredTasks();
  const s = useTaskStore();
  const { setFilters, createTask } = s;

  const [open, setOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const query = useTaskStore((st) => st.filters.text);

  const handleExport = () => {
    const data = JSON.stringify(useTaskStore.getState().tasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kanban-tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error("Invalid JSON shape");
        const incoming: Task[] = parsed.filter(
          (x) => x && typeof x.id === "string" && typeof x.title === "string"
        );
        const current = useTaskStore.getState().tasks;
        const map = new Map<string, Task>(current.map((t) => [t.id, t]));
        for (const t of incoming) map.set(t.id, t);
        useTaskStore.setState({ tasks: Array.from(map.values()) });
        alert(`Imported ${incoming.length} tasks`);
      } catch (e) {
        alert("Import failed: " + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const selectedCount = Object.keys(s.selected).length;
  const allVisibleSelected =
    tasks.length > 0 && tasks.every((t) => s.isSelected(t.id));

  const extra = (
    <div className="flex items-center gap-2">
      {!s.selectionMode ? (
        <>
          <button className="btn" onClick={() => s.toggleSelectionMode(true)}>
            Select
          </button>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => fileInput.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => handleImport(e.target.files?.[0] ?? null)}
          />
        </>
      ) : (
        <>
          <span className="text-sm">{selectedCount} selected</span>
          <button
            className="btn"
            onClick={() => s.selectAll("visible", tasks.map((t) => t.id))}
          >
            Select visible
          </button>
          <button className="btn" onClick={() => s.bulkMove("scheduled")}>
            To Scheduled
          </button>
          <button className="btn" onClick={() => s.bulkMove("in-progress")}>
            To In&nbsp;Progress
          </button>
          <button className="btn" onClick={() => s.bulkMove("done")}>
            To Done
          </button>
          <button
            className="btn text-red-600"
            onClick={() => {
              if (
                selectedCount &&
                confirm(`Delete ${selectedCount} selected?`)
              )
                s.bulkDelete();
            }}
          >
            Delete
          </button>
          <button
            className="btn"
            onClick={() => {
              s.clearSelection();
              s.toggleSelectionMode(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <FiltersBar onCreate={() => setOpen(true)} extraActions={extra} />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              {s.selectionMode && (
                <th className="px-3 py-2">
                  <input
                    aria-label="Select visible tasks"
                    type="checkbox"
                    onChange={(e) =>
                      e.currentTarget.checked
                        ? s.selectAll("visible", tasks.map((t) => t.id))
                        : s.clearSelection()
                    }
                    checked={allVisibleSelected}
                  />
                </th>
              )}
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Assignee</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Tags</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={s.selectionMode ? 6 : 5}>
                  <EmptyState
                    title="No tasks"
                    hint="Try clearing filters or create one."
                  />
                </td>
              </tr>
            )}
            {tasks.map((t) => (
              <tr key={t.id} className="border-t hover:bg-neutral-50">
                {s.selectionMode && (
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      aria-label={`Select ${t.title}`}
                      checked={s.isSelected(t.id)}
                      onChange={() => s.toggleSelect(t.id)}
                    />
                  </td>
                )}
                <td className="px-3 py-2">
                  <Link className="hover:underline" href={`/tasks/${t.id}`}>
                    {query ? highlight(t.title, query) : t.title}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <button
                    className="tag"
                    onClick={() => setFilters({ assignee: t.assignee })}
                  >
                    {query ? highlight(t.assignee, query) : t.assignee}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <span className={`status-pill status-${t.status}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 flex-wrap">
                    {t.tags.map((x) => (
                      <button
                        key={x}
                        className="tag"
                        onClick={() => setFilters({ tag: x })}
                      >
                        {query ? highlight(x, query) : x}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => {
          createTask(v);
          setOpen(false);
        }}
      />
    </div>
  );
}
