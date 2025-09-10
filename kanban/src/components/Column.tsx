"use client";
import { useMemo } from "react";
import type { Status } from "@/lib/types";
import { useFilteredTasks } from "@/lib/taskStore";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

export default function Column({ status, title }: { status: Status; title: string }) {
  const tasks = useFilteredTasks();
  const items = useMemo(() => tasks.filter(t => t.status === status), [tasks, status]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
        <span className="text-xs text-neutral-500">{items.length}</span>
      </div>
      <div className="space-y-3 min-h-24">
        {items.length === 0
          ? <EmptyState title="No tasks in this column" hint="Create a task or move one here." />
          : items.map(t => <TaskCard key={t.id} task={t} />)}
      </div>
    </div>
  );
}
