"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

export function createDynamicComponent(
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => fallback ?? <div className="animate-pulse rounded-lg bg-muted h-32" />,
  })

  return function DynamicWrapper(props: Record<string, unknown>) {
    return (
      <Suspense fallback={fallback ?? <div className="animate-pulse rounded-lg bg-muted h-32" />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
