"use client";
import Link from "next/link";
import {
  Calendar,
  Tag,
  User,
  Pencil,
  Trash2,
  MoveRight,
  GripVertical,
} from "lucide-react";
import type { Task } from "@/lib/types";
import { useTaskStore } from "@/lib/taskStore";
import { formatDate } from "@/lib/date";
import { highlight } from "@/lib/highlight";

type Props = {
  task: Task;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onEdit?: () => void;

  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
};

export default function TaskCard({
  task,
  dragHandleProps,
  onEdit,
  selectionMode,
  selected,
  onToggleSelect,
}: Props) {
  const { deleteTask } = useTaskStore();
  const query = useTaskStore((s) => s.filters.text);
  const stopPointer = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div className="card p-3 space-y-2" data-task-id={task.id}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {selectionMode && (
            <input
              aria-label="Select task"
              type="checkbox"
              className="h-4 w-4"
              checked={!!selected}
              onChange={onToggleSelect}
              onClick={stopPointer}
              onMouseDown={stopPointer}
              onPointerDown={stopPointer}
            />
          )}

          <Link
            href={`/tasks/${task.id}`}
            className="font-serif text-[17px] leading-snug hover:underline"
            onMouseDown={stopPointer}
            onPointerDown={stopPointer}
          >
            {query ? highlight(task.title, query) : task.title}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className={`status-pill status-${task.status}`}>{task.status}</span>
          {dragHandleProps && (
            <button
              aria-label="Drag task"
              className="cursor-grab active:cursor-grabbing -m-1 p-1 rounded hover:bg-neutral-100"
              {...dragHandleProps}
              onClick={(e) => e.preventDefault()}
            >
              <GripVertical size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-600 line-clamp-2">
        {query ? highlight(task.description, query) : task.description}
      </p>

      <div className="flex flex-wrap gap-2 items-center text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1">
          <User size={14} />
          {query ? highlight(task.assignee, query) : task.assignee}
        </span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(task.dueDate)}
          </span>
        )}
        <div className="flex gap-1 items-center">
          <Tag size={14} />
          {task.tags.map((t) => (
            <span key={t} className="tag">
              {query ? highlight(t, query) : t}
            </span>
          ))}
        </div>
      </div>

      {!selectionMode && (
        <div className="flex justify-end gap-2 pt-1">
          <button
            className="btn btn-ghost"
            onMouseDown={stopPointer}
            onPointerDown={stopPointer}
            onClick={() => onEdit?.()}
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            className="btn btn-ghost text-red-600"
            onMouseDown={stopPointer}
            onPointerDown={stopPointer}
            onClick={() => {
              if (confirm(`Delete “${task.title}”?`)) {
                deleteTask(task.id);
              }
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>

          <Link
            href={`/tasks/${task.id}`}
            className="btn btn-ghost"
            onMouseDown={stopPointer}
            onPointerDown={stopPointer}
          >
            <MoveRight size={16} />
            Open
          </Link>
        </div>
      )}
    </div>
  );
}
