"use client";
export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center text-sm text-neutral-500 py-10">
      <div className="font-medium text-neutral-700">{title}</div>
      {hint && <div className="mt-1">{hint}</div>}
    </div>
  );
}
