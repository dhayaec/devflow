import { describe, it, expect, beforeEach } from "vitest"
import { useIssueStore } from "@/stores/issue-store"

const mockIssue = (id: string, overrides = {}) => ({
  id,
  title: `Issue ${id}`,
  status: "backlog",
  priority: "medium",
  type: "task",
  projectId: "proj-1",
  sortOrder: 1000,
  assignee: null,
  reporter: { id: "user-1", name: "Test", image: null },
  sprint: null,
  labels: [],
  _count: { comments: 0, attachments: 0, checklists: 0 },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

beforeEach(() => {
  useIssueStore.setState({
    issues: [],
    selectedIssueId: null,
    filters: { status: null, priority: null, assigneeId: null, sprintId: null },
  })
})

describe("issue-store", () => {
  it("starts with empty state", () => {
    const state = useIssueStore.getState()
    expect(state.issues).toEqual([])
    expect(state.selectedIssueId).toBeNull()
    expect(state.filters).toEqual({
      status: null,
      priority: null,
      assigneeId: null,
      sprintId: null,
    })
  })

  it("sets issues", () => {
    const issues = [mockIssue("1"), mockIssue("2")]
    useIssueStore.getState().setIssues(issues)
    expect(useIssueStore.getState().issues).toHaveLength(2)
  })

  it("adds an issue", () => {
    useIssueStore.getState().addIssue(mockIssue("1"))
    expect(useIssueStore.getState().issues).toHaveLength(1)
    useIssueStore.getState().addIssue(mockIssue("2"))
    expect(useIssueStore.getState().issues).toHaveLength(2)
  })

  it("updates an issue", () => {
    useIssueStore.getState().setIssues([mockIssue("1"), mockIssue("2")])
    useIssueStore.getState().updateIssue("1", { status: "in_progress" })
    const updated = useIssueStore.getState().issues.find((i) => i.id === "1")
    expect(updated?.status).toBe("in_progress")
    const unchanged = useIssueStore.getState().issues.find((i) => i.id === "2")
    expect(unchanged?.status).toBe("backlog")
  })

  it("removes an issue", () => {
    useIssueStore.getState().setIssues([mockIssue("1"), mockIssue("2")])
    useIssueStore.getState().removeIssue("1")
    expect(useIssueStore.getState().issues).toHaveLength(1)
    expect(useIssueStore.getState().issues[0].id).toBe("2")
  })

  it("sets selected issue", () => {
    useIssueStore.getState().setSelectedIssue("issue-1")
    expect(useIssueStore.getState().selectedIssueId).toBe("issue-1")
    useIssueStore.getState().setSelectedIssue(null)
    expect(useIssueStore.getState().selectedIssueId).toBeNull()
  })

  it("sets individual filters", () => {
    useIssueStore.getState().setFilter("status", "in_progress")
    expect(useIssueStore.getState().filters.status).toBe("in_progress")

    useIssueStore.getState().setFilter("priority", "high")
    expect(useIssueStore.getState().filters.priority).toBe("high")
    expect(useIssueStore.getState().filters.status).toBe("in_progress")
  })

  it("resets all filters", () => {
    useIssueStore.getState().setFilter("status", "done")
    useIssueStore.getState().setFilter("assigneeId", "user-1")
    useIssueStore.getState().resetFilters()
    expect(useIssueStore.getState().filters).toEqual({
      status: null,
      priority: null,
      assigneeId: null,
      sprintId: null,
    })
  })
})
