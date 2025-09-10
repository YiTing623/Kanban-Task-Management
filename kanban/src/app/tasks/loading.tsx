export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="card p-3 h-14 animate-pulse" />
      <div className="card overflow-hidden">
        <div className="p-3 space-y-2">
          <div className="h-5 w-1/3 bg-neutral-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-100 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-100 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
