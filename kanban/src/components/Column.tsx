"use client";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Status, Task } from "@/lib/types";
import { useFilteredTasks } from "@/lib/taskStore";
import DraggableTask from "./DraggableTask";
import EmptyState from "./EmptyState";

export default function Column({
  status,
  title,
  onEdit,
}: {
  status: Status;
  title: string;
  onEdit: (task: Task) => void;
}) {
  const tasks = useFilteredTasks();
  const items = useMemo(() => tasks.filter(t => t.status === status), [tasks, status]);
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
        <span className="text-xs text-neutral-500">{items.length}</span>
      </div>

      <div ref={setNodeRef} className={`space-y-3 min-h-24 rounded-lg p-0.5 ${isOver ? "ring-2 ring-neutral-300" : ""}`}>
        <SortableContext items={items.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {items.length === 0
            ? <EmptyState title="No tasks in this column" hint="Drop a task here or create one." />
            : items.map(t => <DraggableTask key={t.id} task={t} onEdit={onEdit} />)}
        </SortableContext>
      </div>
    </div>
  );
}
