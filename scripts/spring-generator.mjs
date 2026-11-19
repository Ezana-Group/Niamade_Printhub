/**
 * Spring easing generator for PrintHub Africa.
 * Generates CSS linear() easing curves from damped harmonic oscillator physics.
 *
 * Smooth: damping ratio zeta = 1.0 (critically damped), response = 0.40s, settle ~540ms
 * Snappy: damping ratio zeta = 1.0 (critically damped), response = 0.28s, settle ~380ms
 * Bounce: damping ratio zeta = 0.8 (under-damped), response = 0.30s, settle ~380ms
 */

function generateSpringLinear(zeta, response, durationMs, steps = 48) {
  const omega0 = (2 * Math.PI) / response; // Natural angular frequency
  const durationSec = durationMs / 1000;
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * durationSec;
    let val;

    if (zeta >= 1.0) {
      // Critically damped (zeta = 1.0) step response:
      // x(t) = 1 - e^(-w*t) * (1 + w*t)
      val = 1 - Math.exp(-omega0 * t) * (1 + omega0 * t);
    } else {
      // Under-damped (zeta < 1.0) step response:
      // x(t) = 1 - e^(-zeta*w*t) * [cos(wd*t) + (zeta/sqrt(1-zeta^2))*sin(wd*t)]
      const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
      const decay = Math.exp(-zeta * omega0 * t);
      const osc = Math.cos(omegaD * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * t);
      val = 1 - decay * osc;
    }

    // Round to 4 decimal places for clean CSS
    points.push(Math.round(val * 10000) / 10000);
  }

  // Ensure start is exactly 0 and end is exactly 1
  points[0] = 0;
  points[points.length - 1] = 1;

  return `linear(${points.join(", ")})`;
}

export const springs = {
  smooth: {
    zeta: 1.0,
    response: 0.40,
    durationMs: 540,
    linear: generateSpringLinear(1.0, 0.40, 540, 48),
  },
  snappy: {
    zeta: 1.0,
    response: 0.28,
    durationMs: 380,
    linear: generateSpringLinear(1.0, 0.28, 380, 48),
  },
  bounce: {
    zeta: 0.8,
    response: 0.30,
    durationMs: 380,
    linear: generateSpringLinear(0.8, 0.30, 380, 48),
  },
};

if (process.argv[1]?.endsWith("spring-generator.mjs")) {
  console.log("/* Generated Spring CSS Variables */");
  console.log(`--spring-smooth: ${springs.smooth.linear};`);
  console.log(`--spring-smooth-d: ${springs.smooth.durationMs}ms;`);
  console.log(`--spring-snappy: ${springs.snappy.linear};`);
  console.log(`--spring-snappy-d: ${springs.snappy.durationMs}ms;`);
  console.log(`--spring-bounce: ${springs.bounce.linear};`);
  console.log(`--spring-bounce-d: ${springs.bounce.durationMs}ms;`);
}
