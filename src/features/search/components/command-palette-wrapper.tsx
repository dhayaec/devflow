"use client"

import { useState } from "react"
import { CommandPalette } from "./command-palette"

export function CommandPaletteWrapper({ userId: _userId }: { userId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 rounded-md border border-input bg-transparent px-3 text-xs text-muted-foreground hover:bg-accent transition-colors w-32"
        aria-label="Search"
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden lg:inline ml-auto text-[10px] rounded border px-1 font-mono">⌘K</kbd>
      </button>

      {open && (
        <CommandPalette
          organizationId=""
          orgSlug=""
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
