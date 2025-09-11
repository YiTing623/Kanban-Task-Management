"use client";
import { useEffect } from "react";

export default function TaskDetailError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="card p-6 space-y-3">
      <h2 className="text-lg font-semibold">Couldn’t open this task</h2>
      <p className="text-sm text-neutral-600">Please go back or retry.</p>
      <div className="flex gap-2">
        <button className="btn" onClick={() => history.back()}>Back</button>
        <button className="btn btn-primary" onClick={() => reset()}>Retry</button>
      </div>
    </div>
  );
}
