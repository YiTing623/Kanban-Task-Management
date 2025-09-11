"use client";
import Link from "next/link";
import { Calendar, Tag, User, Pencil, Trash2, MoveRight, GripVertical } from "lucide-react";
import type { Task } from "@/lib/types";
import { useTaskStore } from "@/lib/taskStore";
import { formatDate } from "@/lib/date";

type Props = {
  task: Task;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onEdit?: () => void;
};

export default function TaskCard({ task, dragHandleProps, onEdit }: Props) {
  const { deleteTask } = useTaskStore();
  const stopPointer = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div className="card p-3 space-y-2" data-task-id={task.id}>
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/tasks/${task.id}`}
          className="font-serif text-[17px] leading-snug hover:underline"
          onMouseDown={stopPointer}
          onPointerDown={stopPointer}
        >
          {task.title}
        </Link>

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

      <p className="text-sm text-neutral-600 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-2 items-center text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1"><User size={14}/>{task.assignee}</span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={14}/>{formatDate(task.dueDate)}
          </span>
        )}
        <div className="flex gap-1 items-center">
          <Tag size={14}/>
          {task.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          className="btn btn-ghost"
          onMouseDown={stopPointer}
          onPointerDown={stopPointer}
          onClick={() => onEdit?.()}
        >
          <Pencil size={16}/>Edit
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
          <Trash2 size={16}/>Delete
        </button>

        <Link
          href={`/tasks/${task.id}`}
          className="btn btn-ghost"
          onMouseDown={stopPointer}
          onPointerDown={stopPointer}
        >
          <MoveRight size={16}/>Open
        </Link>
      </div>
    </div>
  );
}
