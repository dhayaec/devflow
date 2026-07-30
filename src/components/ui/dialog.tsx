"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = () => onClose()
    el.addEventListener("close", handler)
    return () => el.removeEventListener("close", handler)
  }, [onClose])

  if (!open) return null

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 m-auto rounded-xl border bg-background p-0 shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-in fade-in-0 zoom-in-95",
        "w-full max-w-lg",
        className,
      )}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      {children}
    </dialog>
  )
}

export function DialogHeader({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode
  onClose?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-6 py-4",
        className,
      )}
    >
      <div className="text-lg font-semibold">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  )
}
