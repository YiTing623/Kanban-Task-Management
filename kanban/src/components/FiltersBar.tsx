"use client";
import { useMemo } from "react";
import { useTaskStore } from "@/lib/taskStore";
import { Plus } from "lucide-react";

const SORT_OPTIONS = [
  { v: "manual:asc",   label: "Manual (Board order)" },
  { v: "created:desc", label: "Created: New → Old" },
  { v: "created:asc",  label: "Created: Old → New" },
  { v: "due:asc",      label: "Due: Soonest" },
  { v: "due:desc",     label: "Due: Latest" },
  { v: "priority:desc",label: "Priority: High → Low" },
  { v: "priority:asc", label: "Priority: Low → High" },
  { v: "title:asc",    label: "Title: A → Z" },
  { v: "title:desc",   label: "Title: Z → A" },
] as const;

export default function FiltersBar({
  onCreate,
  extraActions,
}: {
  onCreate: () => void;
  extraActions?: React.ReactNode;
}) {
  const { tasks, filters, setFilters, sort, setSort } = useTaskStore();

  const assignees = useMemo(() => Array.from(new Set(tasks.map(t => t.assignee))), [tasks]);
  const tags = useMemo(() => Array.from(new Set(tasks.flatMap(t => t.tags))), [tasks]);

  const sortValue = `${sort.key}:${sort.dir}`;

  return (
    <div className="card p-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        <input
          className="input md:max-w-xs"
          placeholder="Filter by text"
          value={filters.text}
          onChange={(e) => setFilters({ text: e.target.value })}
        />
        <select
          className="input md:max-w-xs"
          value={filters.assignee}
          onChange={(e) => setFilters({ assignee: e.target.value })}
        >
          <option value="">All assignees</option>
          {assignees.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          className="input md:max-w-xs"
          value={filters.tag}
          onChange={(e) => setFilters({ tag: e.target.value })}
        >
          <option value="">All tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          className="input md:max-w-xs"
          aria-label="Sort tasks"
          value={sortValue}
          onChange={(e) => {
            const [key, dir] = e.target.value.split(":") as ["created"|"due"|"priority"|"title", "asc"|"desc"];
            setSort({ key, dir });
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.v} value={opt.v}>{opt.label}</option>
          ))}
        </select>

        <button
          className="btn md:ml-2"
          onClick={() => setFilters({ text: "", assignee: "", tag: "" })}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>

      <div className="flex items-center gap-2">
        {extraActions}
        <button onClick={onCreate} className="btn self-start md:self-auto">
          <Plus size={16}/>New Task
        </button>
      </div>
    </div>
  );
}
