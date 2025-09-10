"use client";
import { useEffect, useState } from "react";
import type { Task, Status, Priority } from "@/lib/types";

export default function TaskFormModal({
  open, initial, onClose, onSubmit,
}: {
  open: boolean;
  initial?: Partial<Task>;
  onClose: () => void;
  onSubmit: (values: Omit<Task, "id" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assignee, setAssignee] = useState(initial?.assignee ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "scheduled");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [dueDate, setDueDate] = useState(initial?.dueDate?.substring(0,10) ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setAssignee(initial?.assignee ?? "");
    setStatus(initial?.status ?? "scheduled");
    setTags((initial?.tags ?? []).join(", "));
    setDueDate(initial?.dueDate?.substring(0,10) ?? "");
    setPriority(initial?.priority ?? "medium");
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="card w-full max-w-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{initial?.title ? "Edit Task" : "Create Task"}</h3>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-3">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="input min-h-24" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="input" placeholder="Assignee" value={assignee} onChange={e=>setAssignee(e.target.value)} />
            <select className="input" value={status} onChange={e=>setStatus(e.target.value as Status)}>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select className="input" value={priority} onChange={e=>setPriority(e.target.value as Priority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <input className="input" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
          <input className="input" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <div className="flex justify-end">
            <button
              className="btn"
              onClick={() =>
                onSubmit({
                  title,
                  description,
                  assignee,
                  status,
                  tags: tags.split(",").map(s=>s.trim()).filter(Boolean),
                  dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                  priority,
                })
              }
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
