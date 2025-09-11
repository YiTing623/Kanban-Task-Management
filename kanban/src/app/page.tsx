"use client";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "@/components/Column";
import FiltersBar from "@/components/FiltersBar";
import TaskFormModal from "@/components/TaskFormModal";
import { useTaskStore } from "@/lib/taskStore";
import type { Status } from "@/lib/types";
import type { Task } from "@/lib/types";

export default function BoardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const { createTask, updateTask, reorderWithinStatus, moveToStatusAtIndex } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const { tasks, reorderWithinStatus, moveToStatusAtIndex } = useTaskStore.getState();
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      if (overTask.status === activeTask.status) {
        reorderWithinStatus?.(activeId, overId);
      } else {
        const destStatus: Status = overTask.status;
        const destIndex = tasks.filter(t => t.status === destStatus).findIndex(t => t.id === overId);
        moveToStatusAtIndex?.(activeId, destStatus, destIndex < 0 ? undefined : destIndex);
      }
      return;
    }

    const maybeStatus = overId as Status;
    if (maybeStatus === "scheduled" || maybeStatus === "in-progress" || maybeStatus === "done") {
      if (activeTask.status !== maybeStatus) {
        moveToStatusAtIndex?.(activeId, maybeStatus, Number.MAX_SAFE_INTEGER);
      } else {
        const ids = tasks.filter(t => t.status === maybeStatus).map(t => t.id);
        const lastId = ids[ids.length - 1];
        if (lastId && lastId !== activeId) {
          reorderWithinStatus?.(activeId, lastId);
        }
      }
    }
  };


  return (
    <div className="space-y-4">
      <FiltersBar onCreate={() => setCreateOpen(true)} />

      <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card p-3">
            <Column status="scheduled" title="Scheduled" onEdit={(t) => setEditing(t)} />
          </div>
          <div className="card p-3">
            <Column status="in-progress" title="In Progress" onEdit={(t) => setEditing(t)} />
          </div>
          <div className="card p-3">
            <Column status="done" title="Done" onEdit={(t) => setEditing(t)} />
          </div>
        </div>
      </DndContext>

      <TaskFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => {
          const id = createTask(v);
          setCreateOpen(false);
          requestAnimationFrame(() => {
            const el = document.querySelector(`[data-task-id="${id}"]`) as HTMLElement | null;
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            el?.classList.add("ring-2", "ring-sky-400");
            setTimeout(() => el?.classList.remove("ring-2", "ring-sky-400"), 1200);
          });
        }}
      />

      <TaskFormModal
        open={!!editing}
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSubmit={(v) => {
          if (editing) updateTask(editing.id, v);
          setEditing(null);
        }}
      />
    </div>
  );
}
