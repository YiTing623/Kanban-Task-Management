"use client";
import { useState } from "react";
import Link from "next/link";
import { useFilteredTasks, useTaskStore } from "@/lib/taskStore";
import FiltersBar from "@/components/FiltersBar";
import EmptyState from "@/components/EmptyState";
import TaskFormModal from "@/components/TaskFormModal";
import { formatDate } from "@/lib/date";

export default function TasksListPage() {
  const tasks = useFilteredTasks();
  const { setFilters, createTask } = useTaskStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <FiltersBar onCreate={() => setOpen(true)} />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
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
                <td colSpan={5}>
                  <EmptyState title="No tasks" hint="Try clearing filters or create one." />
                </td>
              </tr>
            )}
            {tasks.map((t) => (
              <tr key={t.id} className="border-t hover:bg-neutral-50">
                <td className="px-3 py-2">
                  <Link className="hover:underline" href={`/tasks/${t.id}`}>
                    {t.title}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <button className="tag" onClick={() => setFilters({ assignee: t.assignee })}>
                    {t.assignee}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <span className={`status-pill status-${t.status}`}>{t.status}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 flex-wrap">
                    {t.tags.map((x) => (
                      <button key={x} className="tag" onClick={() => setFilters({ tag: x })}>
                        {x}
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
