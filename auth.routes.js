// Geometry helpers for route optimization.
// Stops live on a 0..100 grid; MILE_SCALE converts grid units to miles.
export const MILE_SCALE = 0.26;

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function routeMiles(stops) {
  let m = 0;
  for (let i = 1; i < stops.length; i++) m += dist(stops[i - 1], stops[i]);
  return +(m * MILE_SCALE).toFixed(2);
}

// Estimated drive time in minutes: travel + ~3 min handling per stop.
export function driveMinutes(stops) {
  return Math.round(routeMiles(stops) * 2.4 + (stops.length - 1) * 3);
}

// Nearest-neighbor from a fixed depot (the first stop stays first).
export function nearestNeighbor(stops) {
  if (stops.length < 3) return stops.slice();
  const depot = stops[0];
  const remaining = stops.slice(1);
  const ordered = [depot];
  let current = depot;
  while (remaining.length) {
    let bi = 0, bd = Infinity;
    remaining.forEach((s, i) => {
      const d = dist(current, s);
      if (d < bd) { bd = d; bi = i; }
    });
    current = remaining[bi];
    ordered.push(current);
    remaining.splice(bi, 1);
  }
  return ordered;
}
