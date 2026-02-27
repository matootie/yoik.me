import { describe, it, expect } from "vitest"
import { getName, getColor } from "./id"

describe("getName", () => {
  it("returns a two-word name", () => {
    const name = getName("test-user-id")
    expect(name.split(" ")).toHaveLength(2)
  })

  it("returns consistent names for the same ID", () => {
    expect(getName("abc123")).toBe(getName("abc123"))
  })

  it("returns different names for different IDs", () => {
    expect(getName("user-a")).not.toBe(getName("user-b"))
  })

  it("capitalizes both words", () => {
    const name = getName("some-id")
    const [adj, noun] = name.split(" ")
    expect(adj[0]).toBe(adj[0].toUpperCase())
    expect(noun[0]).toBe(noun[0].toUpperCase())
  })
})

describe("getColor", () => {
  it("returns a hex color string", () => {
    const color = getColor("test-user-id")
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })

  it("returns consistent colors for the same ID", () => {
    expect(getColor("abc123")).toBe(getColor("abc123"))
  })

  it("returns different colors for different IDs", () => {
    expect(getColor("user-a")).not.toBe(getColor("user-b"))
  })
})
