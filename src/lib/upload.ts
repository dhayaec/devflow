const endpoint = process.env.STORAGE_ENDPOINT ?? ""
const region = process.env.STORERAGE_REGION ?? "us-east-1"
const accessKey = process.env.STORAGE_ACCESS_KEY ?? ""
const secretKey = process.env.STORAGE_SECRET_KEY ?? ""
const bucket = process.env.STORAGE_BUCKET ?? "devflow-uploads"

export function getStorageConfig() {
  return {
    endpoint,
    region,
    accessKey,
    secretKey,
    bucket,
    isConfigured: !!(endpoint && accessKey && secretKey),
  }
}

export function createUploadKey(organizationId: string, projectId: string, fileName: string): string {
  const timestamp = Date.now()
  const safe = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
  return `${organizationId}/${projectId}/${timestamp}-${safe}`
}
