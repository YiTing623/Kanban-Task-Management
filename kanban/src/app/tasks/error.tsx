"use client";
import { useEffect } from "react";

export default function TasksError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="card p-6 space-y-3">
      <h2 className="text-lg font-semibold">Backlog failed to load</h2>
      <p className="text-sm text-neutral-600">Something broke while rendering the backlog.</p>
      <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
    </div>
  );
}
