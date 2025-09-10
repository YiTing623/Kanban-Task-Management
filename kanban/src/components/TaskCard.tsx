"use client";
import Link from "next/link";
import { Calendar, Tag, User, Pencil, Trash2, MoveRight } from "lucide-react";
import type { Task } from "@/lib/types";
import { useTaskStore } from "@/lib/taskStore";

export default function TaskCard({ task }: { task: Task }) {
  const { deleteTask } = useTaskStore();
  return (
    <div className="card p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">
          {task.title}
        </Link>
        <span className={`status-pill status-${task.status}`}>{task.status}</span>
      </div>

      <p className="text-sm text-neutral-600 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-2 items-center text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1"><User size={14}/>{task.assignee}</span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={14}/>{new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        <div className="flex gap-1 items-center">
          <Tag size={14}/>
          {task.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Link href={`/tasks/${task.id}`} className="btn"><Pencil size={16}/>Edit</Link>
        <button className="btn text-red-600" onClick={() => deleteTask(task.id)}>
          <Trash2 size={16}/>Delete
        </button>
        <Link href={`/tasks/${task.id}`} className="btn"><MoveRight size={16}/>Open</Link>
      </div>
    </div>
  );
}
