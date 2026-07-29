interface SprintProgressProps {
  total: number
  completed: number
  label?: string
}

export function SprintProgress({
  total,
  completed,
  label,
}: SprintProgressProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">
            {completed}/{total} ({pct}%)
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
