import { describe, it, expect, beforeEach } from "vitest"
import { useSidebarStore } from "@/stores/sidebar-store"

beforeEach(() => {
  useSidebarStore.setState({ collapsed: false })
})

describe("sidebar-store", () => {
  it("starts expanded", () => {
    expect(useSidebarStore.getState().collapsed).toBe(false)
  })

  it("toggles collapsed state", () => {
    useSidebarStore.getState().toggle()
    expect(useSidebarStore.getState().collapsed).toBe(true)

    useSidebarStore.getState().toggle()
    expect(useSidebarStore.getState().collapsed).toBe(false)
  })

  it("sets collapsed state directly", () => {
    useSidebarStore.getState().setCollapsed(true)
    expect(useSidebarStore.getState().collapsed).toBe(true)

    useSidebarStore.getState().setCollapsed(false)
    expect(useSidebarStore.getState().collapsed).toBe(false)
  })
})
