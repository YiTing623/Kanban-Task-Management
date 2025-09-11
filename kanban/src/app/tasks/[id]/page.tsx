"use client";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useTaskStore } from "@/lib/taskStore";
import TaskFormModal from "@/components/TaskFormModal";
import { ArrowLeft, MoveRight } from "lucide-react";
import { formatDate } from "@/lib/date";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { tasks, updateTask, moveTask } = useTaskStore();
  const task = useMemo(() => tasks.find((t) => t.id === id), [tasks, id]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && !task) router.replace("/tasks");
  }, [task, tasks.length, router]);

  if (tasks.length === 0) return null;
  if (!task) return null;

  const nextStatus = task.status === "scheduled" ? "in-progress" : "done";

  return (
    <div className="space-y-4">
      <button className="btn" onClick={() => router.back()}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{task.title}</h1>
          <div className="flex gap-2">
            {task.status !== "done" && (
              <button className="btn" onClick={() => moveTask(task.id, nextStatus)}>
                <MoveRight size={16} />
                Move to {nextStatus === "in-progress" ? "In Progress" : "Done"}
              </button>
            )}
            <button className="btn" onClick={() => setOpen(true)}>Edit</button>
          </div>
        </div>

        <div className="text-sm text-neutral-600">Created {formatDate(task.createdAt)}</div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className={`status-pill status-${task.status}`}>{task.status}</span>
          {task.priority && <span className="tag">priority: {task.priority}</span>}
          {task.dueDate && <span className="tag">due {formatDate(task.dueDate)}</span>}
        </div>

        <p className="text-neutral-700 whitespace-pre-wrap">{task.description}</p>

        <div className="text-sm">Assignee: <span className="font-medium">{task.assignee}</span></div>

        <div className="flex gap-1 flex-wrap">
          {task.tags.map((x) => (<span key={x} className="tag">{x}</span>))}
        </div>
      </div>

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        initial={task}
        onSubmit={(v) => { updateTask(task.id, v); setOpen(false); }}
      />
    </div>
  );
}
