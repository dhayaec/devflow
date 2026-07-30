import { describe, it, expect, vi, beforeEach } from "vitest"
import { createAuditLog } from "@/lib/audit"
import { db } from "@/lib/db"

vi.mock("@/lib/db", () => ({
  db: {
    auditLog: {
      create: vi.fn(),
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("createAuditLog", () => {
  it("creates an audit log entry", async () => {
    vi.mocked(db.auditLog.create).mockResolvedValue({} as any)

    await createAuditLog({
      action: "issue.update",
      entityType: "issue",
      entityId: "issue-1",
      userId: "user-1",
      organizationId: "org-1",
      metadata: { field: "status" },
    })

    expect(db.auditLog.create).toHaveBeenCalledWith({
      data: {
        action: "issue.update",
        entityType: "issue",
        entityId: "issue-1",
        userId: "user-1",
        organizationId: "org-1",
        metadata: JSON.stringify({ field: "status" }),
        ipAddress: undefined,
      },
    })
  })

  it("handles missing optional fields", async () => {
    vi.mocked(db.auditLog.create).mockResolvedValue({} as any)

    await createAuditLog({
      action: "issue.view",
      entityType: "issue",
      entityId: "issue-1",
      userId: "user-1",
    })

    expect(db.auditLog.create).toHaveBeenCalledWith({
      data: {
        action: "issue.view",
        entityType: "issue",
        entityId: "issue-1",
        userId: "user-1",
        organizationId: undefined,
        metadata: null,
        ipAddress: undefined,
      },
    })
  })

  it("never throws on db error", async () => {
    vi.mocked(db.auditLog.create).mockRejectedValue(new Error("DB down"))

    await expect(
      createAuditLog({
        action: "issue.update",
        entityType: "issue",
        entityId: "issue-1",
        userId: "user-1",
      }),
    ).resolves.toBeUndefined()
  })
})
