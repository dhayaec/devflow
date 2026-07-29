"use client"

type TypingUser = { id: string; name: string }

export function TypingIndicator({ users }: { users: TypingUser[] }) {
  if (users.length === 0) return null

  const text =
    users.length === 1
      ? `${users[0].name} is typing...`
      : users.length === 2
        ? `${users[0].name} and ${users[1].name} are typing...`
        : `${users[0].name} and ${users.length - 1} others are typing...`

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11">
      <span className="flex gap-0.5">
        <span className="size-1 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="size-1 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="size-1 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
      {text}
    </div>
  )
}
