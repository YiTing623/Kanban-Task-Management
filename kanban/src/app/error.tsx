"use client";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-10">
      <div className="card p-6 space-y-3">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-neutral-600">Please try again.</p>
        <button className="btn btn-primary" onClick={() => reset()}>Reload</button>
      </div>
    </div>
  );
}
