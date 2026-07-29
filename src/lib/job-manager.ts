import { EventEmitter } from "events"

export type JobStatus = "pending" | "running" | "completed" | "failed" | "cancelled"

export interface Job<T = unknown> {
  id: string
  type: string
  data: T
  status: JobStatus
  progress: number
  logs: string[]
  result?: unknown
  error?: string
  createdAt: Date
  updatedAt: Date
}

type JobEventMap = {
  progress: (jobId: string, progress: number, log?: string) => void
  complete: (jobId: string, result: unknown) => void
  fail: (jobId: string, error: string) => void
  cancel: (jobId: string) => void
}

class JobManager {
  private jobs = new Map<string, Job>()
  private emitter = new EventEmitter()
  private counter = 0

  on<K extends keyof JobEventMap>(event: K, listener: JobEventMap[K]): () => void {
    this.emitter.on(event, listener)
    return () => this.emitter.off(event, listener)
  }

  off<K extends keyof JobEventMap>(event: K, listener: JobEventMap[K]): void {
    this.emitter.off(event, listener)
  }

  create<T>(type: string, data: T): Job<T> {
    this.counter++
    const job: Job<T> = {
      id: `job_${Date.now()}_${this.counter}`,
      type,
      data,
      status: "pending",
      progress: 0,
      logs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.jobs.set(job.id, job)
    return job
  }

  get(jobId: string): Job | undefined {
    return this.jobs.get(jobId)
  }

  list(type?: string): Job[] {
    const all = Array.from(this.jobs.values())
    return type ? all.filter((j) => j.type === type) : all
  }

  updateProgress(jobId: string, progress: number, log?: string): void {
    const job = this.jobs.get(jobId)
    if (!job) return
    job.progress = progress
    job.updatedAt = new Date()
    if (log) job.logs.push(log)
    this.emitter.emit("progress", jobId, progress, log)
  }

  complete(jobId: string, result: unknown): void {
    const job = this.jobs.get(jobId)
    if (!job) return
    job.status = "completed"
    job.progress = 100
    job.result = result
    job.updatedAt = new Date()
    this.emitter.emit("complete", jobId, result)
  }

  fail(jobId: string, error: string): void {
    const job = this.jobs.get(jobId)
    if (!job) return
    job.status = "failed"
    job.error = error
    job.updatedAt = new Date()
    this.emitter.emit("fail", jobId, error)
  }

  cancel(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (!job || job.status === "completed") return false
    job.status = "cancelled"
    job.updatedAt = new Date()
    this.emitter.emit("cancel", jobId)
    return true
  }
}

export const jobManager = new JobManager()
