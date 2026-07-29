import { db } from "@/lib/db"

interface AuditLogInput {
  action: string
  entityType: string
  entityId: string
  userId: string
  organizationId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
}

export async function createAuditLog(input: AuditLogInput) {
  try {
    await db.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        userId: input.userId,
        organizationId: input.organizationId,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        ipAddress: input.ipAddress,
      },
    })
  } catch {
    // Audit logging should never throw
  }
}
