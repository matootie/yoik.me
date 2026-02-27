import { describe, it, expect } from "vitest"
import { getName, getColor } from "./id"

describe("getName", () => {
  it("returns a two-word name", () => {
    const name = getName("test-user-id")
    expect(name.split(" ")).toHaveLength(2)
  })

  it("is deterministic", () => {
    expect(getName("abc")).toBe(getName("abc"))
  })

  it("produces different names for different IDs", () => {
    expect(getName("a")).not.toBe(getName("b"))
  })
})

describe("getColor", () => {
  it("returns a valid hex color", () => {
    expect(getColor("test")).toMatch(/^#[0-9a-f]{6}$/)
  })

  it("is deterministic", () => {
    expect(getColor("abc")).toBe(getColor("abc"))
  })
})
