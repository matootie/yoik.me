/**
 * Identity utilities (shared logic for generating names/colors from user IDs).
 * Mirrors the client-side implementation to ensure consistency.
 */

import adj from "../../data/adjectives.json"
import nou from "../../data/nouns.json"

function idToNumber(id: string): number {
  var hash = 5381
  for (var i = 0; i < id.length; i++) {
    hash = (hash << 5) + hash + id.charCodeAt(i)
  }
  return Math.abs(hash)
}

export function getName(id: string): string {
  const x = idToNumber(id)
  const a = adj[x % adj.length]
  const n = nou[x % nou.length]
  const adjective = a[0].toUpperCase() + a.slice(1)
  const noun = n[0].toUpperCase() + n.slice(1)
  return `${adjective} ${noun}`
}

export function getColor(id: string): string {
  var x = idToNumber(id)
  var r = (x & 0xff0000) >> 16
  var g = (x & 0x00ff00) >> 8
  var b = x & 0x0000ff
  return (
    "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2)
  )
}
