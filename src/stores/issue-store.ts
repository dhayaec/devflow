import { create } from "zustand"
import type { Issue } from "@/types/issue"

interface IssueState {
  issues: Issue[]
  selectedIssueId: string | null
  filters: {
    status: string | null
    priority: string | null
    assigneeId: string | null
    sprintId: string | null
  }

  setIssues: (issues: Issue[]) => void
  addIssue: (issue: Issue) => void
  updateIssue: (id: string, data: Partial<Issue>) => void
  removeIssue: (id: string) => void
  setSelectedIssue: (id: string | null) => void
  setFilter: (key: keyof IssueState["filters"], value: string | null) => void
  resetFilters: () => void
}

export const useIssueStore = create<IssueState>((set) => ({
  issues: [],
  selectedIssueId: null,
  filters: {
    status: null,
    priority: null,
    assigneeId: null,
    sprintId: null,
  },

  setIssues: (issues) => set({ issues }),

  addIssue: (issue) =>
    set((state) => ({ issues: [...state.issues, issue] })),

  updateIssue: (id, data) =>
    set((state) => ({
      issues: state.issues.map((i) =>
        i.id === id ? { ...i, ...data } : i,
      ),
    })),

  removeIssue: (id) =>
    set((state) => ({
      issues: state.issues.filter((i) => i.id !== id),
    })),

  setSelectedIssue: (id) => set({ selectedIssueId: id }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({
      filters: { status: null, priority: null, assigneeId: null, sprintId: null },
    }),
}))
