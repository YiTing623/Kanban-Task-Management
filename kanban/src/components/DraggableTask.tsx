"use client";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "@/lib/types";
import TaskCard from "./TaskCard";
import { useTaskStore } from "@/lib/taskStore";

export default function DraggableTask({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (task: Task) => void;
}) {
  const selectionMode = useTaskStore((s) => s.selectionMode);
  const selected = useTaskStore((s) => !!s.selected[task.id]);
  const toggleSelect = useTaskStore((s) => s.toggleSelect);

  const { setNodeRef, transform, transition, isDragging, attributes, listeners } =
    useSortable({ id: task.id, disabled: selectionMode });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        dragHandleProps={selectionMode ? undefined : { ...attributes, ...listeners }}
        onEdit={() => onEdit(task)}
        selectionMode={selectionMode}
        selected={selected}
        onToggleSelect={() => toggleSelect(task.id)}
      />
    </div>
  );
}
