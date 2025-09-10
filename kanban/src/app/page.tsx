"use client";
import { useState, useMemo } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import Column from "@/components/Column";
import FiltersBar from "@/components/FiltersBar";
import TaskFormModal from "@/components/TaskFormModal";
import { useTaskStore } from "@/lib/taskStore";
import type { Status } from "@/lib/types";

export default function BoardPage() {
  const [open, setOpen] = useState(false);
  const { createTask, reorderWithinStatus, moveToStatusAtIndex } = useTaskStore();

  const extra = useMemo(() => null, []);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const s = useTaskStore.getState();
    const tasks = s.tasks;
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      if (overTask.status === activeTask.status) {
        reorderWithinStatus(activeId, overId);
      } else {
        const destStatus: Status = overTask.status;
        const destIndex = tasks.filter(t => t.status === destStatus).findIndex(t => t.id === overId);
        moveToStatusAtIndex(activeId, destStatus, destIndex < 0 ? undefined : destIndex);
      }
      return;
    }

    const maybeStatus = overId as Status;
    if (maybeStatus === "scheduled" || maybeStatus === "in-progress" || maybeStatus === "done") {
      if (activeTask.status !== maybeStatus) {
        moveToStatusAtIndex(activeId, maybeStatus, undefined);
      }
    }
  };

  return (
    <div className="space-y-4">
      <FiltersBar onCreate={() => setOpen(true)} extraActions={extra} />

      <DndContext
        onDragEnd={onDragEnd}
        collisionDetection={closestCorners}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card p-3"><Column status="scheduled" title="Scheduled" /></div>
          <div className="card p-3"><Column status="in-progress" title="In Progress" /></div>
          <div className="card p-3"><Column status="done" title="Done" /></div>
        </div>
      </DndContext>

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => {
          const id = createTask(v);
          setOpen(false);
          requestAnimationFrame(() => {
            const el = document.querySelector(`[data-task-id="${id}"]`) as HTMLElement | null;
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            el?.classList.add("ring-2", "ring-sky-400");
            setTimeout(() => el?.classList.remove("ring-2", "ring-sky-400"), 1200);
          });
        }}
      />
    </div>
  );
}
