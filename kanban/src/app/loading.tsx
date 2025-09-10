export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="card p-3 h-14 animate-pulse" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-3 space-y-3">
          <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />
          <div className="h-24 bg-neutral-100 rounded animate-pulse" />
          <div className="h-24 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="card p-3 space-y-3">
          <div className="h-5 w-36 bg-neutral-200 rounded animate-pulse" />
          <div className="h-24 bg-neutral-100 rounded animate-pulse" />
          <div className="h-24 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="card p-3 space-y-3">
          <div className="h-5 w-20 bg-neutral-200 rounded animate-pulse" />
          <div className="h-24 bg-neutral-100 rounded animate-pulse" />
          <div className="h-24 bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
