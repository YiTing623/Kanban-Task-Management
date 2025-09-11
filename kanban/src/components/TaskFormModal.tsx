"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { Task, Status, Priority } from "@/lib/types";

export default function TaskFormModal({
  open,
  initial,
  onClose,
  onSubmit,
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
  const [dueDate, setDueDate] = useState(initial?.dueDate?.substring(0, 10) ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");

  const titleId = useId();
  const descId = useId();

  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setAssignee(initial?.assignee ?? "");
    setStatus(initial?.status ?? "scheduled");
    setTags((initial?.tags ?? []).join(", "));
    setDueDate(initial?.dueDate?.substring(0, 10) ?? "");
    setPriority(initial?.priority ?? "medium");

    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open, initial]);

  if (!open) return null;

  const handleOverlayMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Escape") onClose();
  };

  const handleSave = () =>
    onSubmit({
      title,
      description,
      assignee,
      status,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
    });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
      onMouseDown={handleOverlayMouseDown}
      onKeyDown={handleKeyDown}
    >
      <div
        className="card w-full max-w-xl p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 id={titleId} className="text-lg font-semibold">
            {initial?.title ? "Edit Task" : "Create Task"}
          </h3>
          <button type="button" className="btn" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>

        <p id={descId} className="sr-only">
          Fill in task fields, then press Save to confirm or Close to cancel.
        </p>

        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label className="sr-only" htmlFor="task-title">Title</label>
          <input
            id="task-title"
            ref={firstFieldRef}
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="sr-only" htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="input min-h-24"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="sr-only" htmlFor="task-assignee">Assignee</label>
              <input
                id="task-assignee"
                className="input"
                placeholder="Assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="sr-only" htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="task-tags">Tags (comma separated)</label>
            <input
              id="task-tags"
              className="input"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="task-due">Due date</label>
            <input
              id="task-due"
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
