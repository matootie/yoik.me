/**
 * Identity utilities.
 */

// Local imports.
import adj from "#utils/adjectives.json"
import nou from "#utils/nouns.json"

/**
 * Convert an alpanumeric ID to a number.
 */
function idToNumber(id: string): number {
  var hash = 5381
  for (var i = 0; i < id.length; i++) {
    hash = (hash << 5) + hash + id.charCodeAt(i)
  }
  return Math.abs(hash)
}

/**
 * Get the generated name associated with an ID.
 */
export function getName(id: string): string {
  const x = idToNumber(id)
  const a = adj[x % adj.length]
  const n = nou[x % nou.length]
  const adjective = a[0].toUpperCase() + a.slice(1)
  const noun = n[0].toUpperCase() + n.slice(1)
  return `${adjective} ${noun}`
}

/**
 * Get the generated color associated with an ID.
 */
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
