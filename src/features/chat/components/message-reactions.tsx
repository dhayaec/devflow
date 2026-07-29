"use client"

type Reaction = { id: string; emoji: string; userId: string }

export function MessageReactions({ reactions }: { reactions: Reaction[] }) {
  const grouped = reactions.reduce(
    (acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = []
      acc[r.emoji].push(r)
      return acc
    },
    {} as Record<string, Reaction[]>,
  )

  return (
    <div className="flex gap-1 mt-1">
      {Object.entries(grouped).map(([emoji, rs]) => (
        <button
          key={emoji}
          className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-xs hover:bg-muted transition-colors"
        >
          <span>{emoji}</span>
          <span className="text-muted-foreground">{rs.length}</span>
        </button>
      ))}
    </div>
  )
}
