"use client"

import { useEffect, useCallback } from "react"
import { useJob } from "@/hooks/use-job"
import { runDeploymentJob } from "@/server/background-jobs"
import { cn } from "@/lib/utils"

interface DeploymentLogStreamProps {
  deploymentId: string
  projectId: string
  environment: string
  onComplete?: () => void
}

export function DeploymentLogStream({
  deploymentId,
  projectId,
  environment,
  onComplete,
}: DeploymentLogStreamProps) {
  const { jobId, state, subscribe } = useJob()

  const startDeployment = useCallback(() => {
    const id = `deploy_${deploymentId}`
    subscribe(id, "deployments")
    runDeploymentJob(deploymentId, projectId, environment)
  }, [deploymentId, projectId, environment, subscribe])

  useEffect(() => {
    startDeployment()
  }, [startDeployment])

  useEffect(() => {
    if (state.status === "completed" && onComplete) {
      onComplete()
    }
  }, [state.status, onComplete])

  const isRunning = state.status === "running"

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Deployment Log</span>
          {isRunning && (
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {isRunning ? `${state.progress}%` : state.status}
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {state.logs.length === 0 && isRunning && (
          <p className="text-muted-foreground">Waiting for output...</p>
        )}
        {state.logs.map((log, i) => (
          <p
            key={i}
            className={cn(
              "leading-relaxed",
              log === "Complete" && "text-emerald-500 font-semibold",
              log.includes("failed") && "text-red-500",
              log.startsWith("Starting") && "text-blue-500",
            )}
          >
            <span className="text-muted-foreground mr-2">{`[${i + 1}]`}</span>
            {log}
          </p>
        ))}
        {state.status === "failed" && state.error && (
          <p className="text-red-500 font-semibold">Error: {state.error}</p>
        )}
        {state.status === "completed" && (
          <p className="text-emerald-500 font-semibold">Deployment successful</p>
        )}
      </div>

      <div className="flex items-center gap-2 border-t px-4 py-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              state.status === "failed" ? "bg-red-500" : "bg-primary",
            )}
            style={{ width: `${state.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
