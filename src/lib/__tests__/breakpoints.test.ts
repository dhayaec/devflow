import { describe, it, expect } from "vitest"
import { getResponsiveClass, breakpoints } from "@/lib/breakpoints"

describe("getResponsiveClass", () => {
  it("returns base class when no responsive overrides", () => {
    expect(getResponsiveClass("p-4")).toBe("p-4")
  })

  it("includes sm prefix", () => {
    expect(getResponsiveClass("p-4", "p-2")).toBe("p-4 sm:p-2")
  })

  it("includes md prefix", () => {
    expect(getResponsiveClass("p-4", undefined, "p-6")).toBe("p-4 md:p-6")
  })

  it("includes lg prefix", () => {
    expect(getResponsiveClass("p-4", undefined, undefined, "p-8")).toBe("p-4 lg:p-8")
  })

  it("includes all responsive prefixes", () => {
    expect(getResponsiveClass("p-4", "p-2", "p-6", "p-8")).toBe("p-4 sm:p-2 md:p-6 lg:p-8")
  })
})

describe("breakpoints", () => {
  it("has correct breakpoint values", () => {
    expect(breakpoints.sm).toBe(640)
    expect(breakpoints.md).toBe(768)
    expect(breakpoints.lg).toBe(1024)
    expect(breakpoints.xl).toBe(1280)
    expect(breakpoints["2xl"]).toBe(1536)
  })
})
