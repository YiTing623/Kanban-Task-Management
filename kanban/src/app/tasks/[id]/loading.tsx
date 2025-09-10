export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-9 w-24 btn animate-pulse" />
      <div className="card p-4 space-y-3">
        <div className="h-7 w-2/3 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-40 bg-neutral-100 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-neutral-100 rounded-full animate-pulse" />
          <div className="h-6 w-28 bg-neutral-100 rounded-full animate-pulse" />
        </div>
        <div className="h-24 w-full bg-neutral-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
