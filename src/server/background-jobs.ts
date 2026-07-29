import { db } from "@/lib/db"
import { jobManager } from "@/lib/job-manager"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function runDeploymentJob(
  deploymentId: string,
  projectId: string,
  environment: string,
): Promise<void> {
  const job = jobManager.create("deployment", { deploymentId, projectId, environment })
  jobManager.updateProgress(job.id, 0, `Starting deployment to ${environment}...`)

  try {
    await db.deployment.update({
      where: { id: deploymentId },
      data: { status: "running", startedAt: new Date() },
    })
    jobManager.updateProgress(job.id, 5, "Provisioning environment...")
    await sleep(1500)

    jobManager.updateProgress(job.id, 20, "Installing dependencies...")
    await sleep(1200)

    jobManager.updateProgress(job.id, 40, "Running build...")
    await sleep(2000)

    jobManager.updateProgress(job.id, 60, "Running tests...")
    await sleep(1500)

    jobManager.updateProgress(job.id, 80, "Deploying to environment...")
    await sleep(2000)

    const url = `https://${environment}-${projectId.slice(0, 8)}.devflow.app`
    await db.deployment.update({
      where: { id: deploymentId },
      data: {
        status: "success",
        url,
        finishedAt: new Date(),
      },
    })
    jobManager.updateProgress(job.id, 100, `Deployment complete: ${url}`)
    jobManager.complete(job.id, { deploymentId, status: "success", url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deployment failed"
    await db.deployment.update({
      where: { id: deploymentId },
      data: { status: "failed", finishedAt: new Date() },
    })
    jobManager.updateProgress(job.id, 0, message)
    jobManager.fail(job.id, message)
  }
}

export async function runImportJob(
  organizationId: string,
  projectId: string,
  userId: string,
  importType: string,
  data: Record<string, unknown>[],
): Promise<void> {
  const job = jobManager.create("import", { organizationId, projectId, userId, importType })
  jobManager.updateProgress(job.id, 0, `Starting ${importType} import...`)

  try {
    const total = data.length
    for (let i = 0; i < total; i++) {
      const pct = Math.round(((i + 1) / total) * 90)
      jobManager.updateProgress(job.id, pct, `Importing item ${i + 1} of ${total}...`)

      if (importType === "issues") {
        const row = data[i]
        await db.issue.create({
          data: {
            title: String(row.title ?? "Untitled"),
            description: row.description ? String(row.description) : undefined,
            status: String(row.status ?? "backlog"),
            priority: String(row.priority ?? "medium"),
            type: String(row.type ?? "task"),
            projectId,
            reporterId: userId,
          },
        })
      }
      await sleep(200)
    }

    jobManager.updateProgress(job.id, 100, `Import complete: ${total} items`)
    jobManager.complete(job.id, { imported: total, importType })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed"
    jobManager.fail(job.id, message)
  }
}

export async function runExportJob(
  organizationId: string,
  projectId: string,
  exportType: string,
): Promise<void> {
  const job = jobManager.create("export", { organizationId, projectId, exportType })
  jobManager.updateProgress(job.id, 0, `Starting ${exportType} export...`)

  try {
    let data: unknown[] = []

    if (exportType === "issues") {
      jobManager.updateProgress(job.id, 10, "Fetching issues...")
      const issues = await db.issue.findMany({
        where: { projectId },
        include: {
          labels: { include: { label: true } },
          assignee: { select: { name: true } },
        },
      })
      data = issues.map((i) => ({
        title: i.title,
        status: i.status,
        priority: i.priority,
        type: i.type,
        assignee: i.assignee?.name ?? null,
        labels: i.labels.map((l) => l.label.name).join(", "),
        createdAt: i.createdAt.toISOString(),
      }))
      jobManager.updateProgress(job.id, 60, `Found ${data.length} issues`)
    } else if (exportType === "documents") {
      jobManager.updateProgress(job.id, 10, "Fetching documents...")
      const docs = await db.document.findMany({
        where: { projectId },
      })
      data = docs.map((d) => ({
        title: d.title,
        content: d.content,
        updatedAt: d.updatedAt.toISOString(),
      }))
      jobManager.updateProgress(job.id, 60, `Found ${data.length} documents`)
    }

    jobManager.updateProgress(job.id, 90, "Generating export file...")
    await sleep(1000)

    jobManager.updateProgress(job.id, 100, "Export complete")
    jobManager.complete(job.id, { data, count: data.length, exportType })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed"
    jobManager.fail(job.id, message)
  }
}
