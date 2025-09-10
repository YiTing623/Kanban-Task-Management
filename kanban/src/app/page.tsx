"use client";
import { useState } from "react";
import Column from "@/components/Column";
import FiltersBar from "@/components/FiltersBar";
import TaskFormModal from "@/components/TaskFormModal";
import { useTaskStore } from "@/lib/taskStore";

export default function BoardPage() {
  const [open, setOpen] = useState(false);
  const { createTask } = useTaskStore();

  return (
    <div className="space-y-4">
      <FiltersBar onCreate={() => setOpen(true)} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-3"><Column status="scheduled" title="Scheduled" /></div>
        <div className="card p-3"><Column status="in-progress" title="In Progress" /></div>
        <div className="card p-3"><Column status="done" title="Done" /></div>
      </div>

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => { const id = createTask(v); setOpen(false);
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
