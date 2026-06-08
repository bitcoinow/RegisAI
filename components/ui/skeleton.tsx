const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, var(--bg-2) 25%, var(--rule) 50%, var(--bg-2) 75%)',
  backgroundSize: '200% 100%',
}

// Base shimmer skeleton — warm tones using brand CSS vars
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={['rounded animate-shimmer', className].filter(Boolean).join(' ')}
      style={shimmerStyle}
    />
  )
}

// Single text-line placeholder
export function SkeletonText({
  className,
  width = 'w-full',
}: {
  className?: string
  width?: string
}) {
  return (
    <Skeleton className={['h-4', width, className].filter(Boolean).join(' ')} />
  )
}

// Audit card skeleton — firm name, date, 4 risk badge rects, gap count
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={['p-6 border border-rule flex flex-col gap-4', className].filter(Boolean).join(' ')}
      style={{ background: 'var(--bg)' }}
    >
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-1/4" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16" />
        ))}
      </div>
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}

// Finding row skeleton — risk badge rect + two text lines
export function SkeletonFinding({ className }: { className?: string }) {
  return (
    <div className={['flex items-start gap-4 py-3', className].filter(Boolean).join(' ')}>
      <Skeleton className="h-6 w-16 shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

// Monitoring feed item skeleton — title + summary lines + date
export function SkeletonFeed({ className }: { className?: string }) {
  return (
    <div className={['flex flex-col gap-2 py-4', className].filter(Boolean).join(' ')}>
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}
