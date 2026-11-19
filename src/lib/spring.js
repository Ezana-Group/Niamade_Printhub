/**
 * Pure physics and gesture math for Apple-grade motion and interactive sheets.
 * Zero DOM dependencies — fully testable in Node.
 */

/**
 * Rubber-band resistance formula:
 * As offset exceeds boundary, resistance increases progressively.
 *
 * @param {number} offset - Distance past the boundary (px, positive or negative)
 * @param {number} dimension - Range or dimension of the element (e.g. sheet height)
 * @param {number} constant - Resistance coefficient (Apple default ~0.55)
 * @returns {number} Resisted offset
 */
export function rubberband(offset, dimension, constant = 0.55) {
  if (dimension <= 0) return 0;
  const absOffset = Math.abs(offset);
  const resisted = (absOffset * dimension * constant) / (dimension + constant * absOffset);
  return Math.sign(offset) * resisted;
}

/**
 * Momentum projection with exponential decay.
 * Projects final resting point from current position and instantaneous release velocity.
 *
 * @param {number} current - Current position (px)
 * @param {number} velocity - Instantaneous velocity (px/second)
 * @param {number} decay - Per-millisecond decay coefficient (default 0.998)
 * @returns {number} Projected resting position
 */
export function project(current, velocity, decay = 0.998) {
  // Integral of v0 * decay^t from t=0 to infinity:
  // (v / 1000) * decay / (1 - decay)
  return current + (velocity / 1000) * (decay / (1 - decay));
}

/**
 * Computes release velocity from pointer sample history over the last windowMs (default 100ms).
 *
 * @param {Array<{ x?: number, y: number, t: number }>} samples - History of { y, t } timestamps (t in ms)
 * @param {number} windowMs - Time window to consider (default 100ms)
 * @returns {number} Velocity in px/second (positive = downward, negative = upward)
 */
export function releaseVelocity(samples, windowMs = 100) {
  if (!samples || samples.length < 2) return 0;
  const now = samples[samples.length - 1].t;
  const cutoff = now - windowMs;
  const recent = samples.filter((s) => s.t >= cutoff);

  if (recent.length < 2) {
    const p1 = samples[samples.length - 2];
    const p2 = samples[samples.length - 1];
    const dt = (p2.t - p1.t) / 1000;
    return dt > 0 ? (p2.y - p1.y) / dt : 0;
  }

  const first = recent[0];
  const last = recent[recent.length - 1];
  const dt = (last.t - first.t) / 1000;
  return dt > 0 ? (last.y - first.y) / dt : 0;
}

/**
 * Damped harmonic oscillator step response evaluator at time t.
 *
 * @param {number} t - Time in seconds
 * @param {number} from - Starting position
 * @param {number} to - Target position
 * @param {number} v0 - Initial velocity (px/second)
 * @param {number} zeta - Damping ratio (1.0 = critically damped, <1.0 = under-damped)
 * @param {number} response - Response time in seconds
 * @returns {{ position: number, velocity: number }}
 */
export function evaluateSpring(t, from, to, v0, zeta, response) {
  const omega0 = (2 * Math.PI) / response;
  const delta = from - to; // displacement from target

  if (zeta >= 1.0) {
    // Critically damped (zeta = 1.0):
    // x(t) = to + e^(-w0*t) * [delta + (v0 + w0*delta)*t]
    const c1 = delta;
    const c2 = v0 + omega0 * delta;
    const decay = Math.exp(-omega0 * t);
    const pos = to + decay * (c1 + c2 * t);
    const vel = decay * (c2 - omega0 * (c1 + c2 * t));
    return { position: pos, velocity: vel };
  } else {
    // Under-damped (zeta < 1.0):
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const c1 = delta;
    const c2 = (v0 + zeta * omega0 * delta) / omegaD;
    const decay = Math.exp(-zeta * omega0 * t);
    const cosVal = Math.cos(omegaD * t);
    const sinVal = Math.sin(omegaD * t);

    const pos = to + decay * (c1 * cosVal + c2 * sinVal);
    const vel = decay * ((-zeta * omega0 * (c1 * cosVal + c2 * sinVal)) + (c2 * omegaD * cosVal - c1 * omegaD * sinVal));
    return { position: pos, velocity: vel };
  }
}
