export default function StudioLoading() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b-2 border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-8 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-4 w-20 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar skeleton */}
        <aside className="hidden w-72 shrink-0 border-r-2 border-border bg-secondary/30 p-4 lg:block">
          <div className="space-y-4">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border-2 border-border bg-card"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </aside>

        {/* Main area skeleton */}
        <main className="flex flex-1 flex-col overflow-hidden p-4">
          <div className="flex-1 animate-pulse rounded-3xl border-2 border-border bg-card/50" />
        </main>

        {/* Right sidebar skeleton */}
        <aside className="hidden w-80 shrink-0 border-l-2 border-border bg-secondary/30 p-4 xl:block">
          <div className="space-y-4">
            <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-28 animate-pulse rounded-2xl border-2 border-border bg-card" />
            <div className="h-28 animate-pulse rounded-2xl border-2 border-border bg-card" />
            <div className="h-40 animate-pulse rounded-2xl border-2 border-border bg-card" />
          </div>
        </aside>
      </div>
    </div>
  );
}
