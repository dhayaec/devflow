"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"

type ResultItem = {
  type: "project" | "issue" | "document" | "user"
  id: string
  label: string
  href: string
}

type SearchResults = {
  projects: ResultItem[]
  issues: ResultItem[]
  documents: ResultItem[]
  users: ResultItem[]
}

export function CommandPalette({
  organizationId,
  orgSlug,
  onClose,
}: {
  organizationId: string
  orgSlug: string
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 200)

  const allResults = results
    ? [...results.projects, ...results.issues, ...results.documents, ...results.users]
    : []

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null)
      return
    }

    setLoading(true)
    const params = new URLSearchParams({
      q: debouncedQuery,
      organizationId,
    })
    fetch(`/api/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results ?? null)
        setSelectedIndex(0)
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false))
  }, [debouncedQuery, organizationId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, Math.max(allResults.length - 1, 0)))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter" && allResults[selectedIndex]) {
        e.preventDefault()
        onClose()
      }
    },
    [allResults, selectedIndex, onClose],
  )

  const grouped = results
    ? [
        { label: "Projects", items: results.projects },
        { label: "Issues", items: results.issues },
        { label: "Documents", items: results.documents },
        { label: "Users", items: results.users },
      ].filter((g) => g.items.length > 0)
    : []

  let currentGlobalIndex = 0

  return (
    <>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border bg-popover shadow-2xl overflow-hidden">
        <div className="flex items-center border-b px-3">
          <svg className="size-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, issues, documents, users..."
            className="flex-1 h-12 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && (
            <div className="size-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.length >= 2 && !loading && grouped.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No results found
            </p>
          )}
          {grouped.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                {group.label}
              </p>
              {group.items.map((item) => {
                const globalIndex = currentGlobalIndex++
                return (
                  <button
                    key={item.id}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      globalIndex === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    onClick={onClose}
                  >
                    <span className="text-xs text-muted-foreground mr-2 uppercase font-mono">
                      {item.type[0]}
                    </span>
                    {item.label}
                  </button>
                )
              })}
            </div>
          ))}
          {!query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}
        </div>

        <div className="border-t px-3 py-2 flex gap-3 text-[10px] text-muted-foreground">
          <span><kbd className="rounded border px-1 font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="rounded border px-1 font-mono">Enter</kbd> select</span>
          <span><kbd className="rounded border px-1 font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </>
  )
}
