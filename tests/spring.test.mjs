import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rubberband, project, releaseVelocity, evaluateSpring } from "../src/lib/spring.js";

describe("Spring and gesture math", () => {
  it("rubberband resists progressively at edges", () => {
    const dim = 500;
    // At zero offset, zero resistance
    assert.equal(rubberband(0, dim), 0);

    // Negative offset (dragged upward past top)
    const r50 = rubberband(-50, dim);
    const r100 = rubberband(-100, dim);
    const r200 = rubberband(-200, dim);

    assert.ok(r50 < 0, "Offset is negative");
    assert.ok(Math.abs(r50) < 50, "Offset is resisted");
    assert.ok(Math.abs(r100) < 100, "Offset is resisted");
    assert.ok(Math.abs(r200) < 200, "Offset is resisted");

    // Progressive resistance: the delta between 100 and 200 should be smaller than 0 and 100
    const delta1 = Math.abs(r100) - 0;
    const delta2 = Math.abs(r200) - Math.abs(r100);
    assert.ok(delta2 < delta1, "Resistance increases progressively with displacement");
  });

  it("project predicts resting point with 0.998 decay", () => {
    const current = 100;
    const velocity = 500; // px/sec
    // projected = 100 + (500 / 1000) * 0.998 / (1 - 0.998)
    // = 100 + 0.5 * 499 = 100 + 249.5 = 349.5
    const projected = project(current, velocity, 0.998);
    assert.ok(Math.abs(projected - 349.5) < 0.1, `Expected ~349.5, got ${projected}`);

    // Zero velocity stays in place
    assert.equal(project(100, 0), 100);

    // Negative velocity projects backwards
    const projectedBack = project(100, -500, 0.998);
    assert.ok(Math.abs(projectedBack - (-149.5)) < 0.1);
  });

  it("releaseVelocity computes accurate velocity from last 100ms of samples", () => {
    const now = 1000;
    const samples = [
      { y: 0, t: 800 },
      { y: 50, t: 880 },
      { y: 100, t: 920 },
      { y: 150, t: 960 },
      { y: 200, t: 1000 },
    ];
    // In the last 100ms (t >= 900):
    // first sample is at t=920, y=100.
    // last sample is at t=1000, y=200.
    // dt = 80ms = 0.08s. dy = 100px.
    // velocity = 100 / 0.08 = 1250 px/s
    const v = releaseVelocity(samples, 100);
    assert.equal(v, 1250);
  });

  it("spring integrator critically damped (zeta = 1.0) does not overshoot target", () => {
    const from = 0;
    const to = 100;
    const v0 = 0;
    const zeta = 1.0;
    const response = 0.40;

    let maxPos = 0;
    for (let ms = 0; ms <= 800; ms += 5) {
      const { position } = evaluateSpring(ms / 1000, from, to, v0, zeta, response);
      if (position > maxPos) maxPos = position;
    }

    assert.ok(maxPos <= 100.0001, `Critically damped must not overshoot 100, got max ${maxPos}`);
    // Settle check at 540ms
    const settled = evaluateSpring(0.54, from, to, v0, zeta, response);
    assert.ok(settled.position >= 99.5, `Should be settled >= 99.5%, got ${settled.position}`);
  });

  it("spring integrator under-damped (zeta = 0.8) overshoot is about 1.5% or less", () => {
    const from = 0;
    const to = 100;
    const v0 = 0;
    const zeta = 0.8;
    const response = 0.30;

    let maxPos = 0;
    for (let ms = 0; ms <= 600; ms += 2) {
      const { position } = evaluateSpring(ms / 1000, from, to, v0, zeta, response);
      if (position > maxPos) maxPos = position;
    }

    const overshoot = maxPos - to;
    assert.ok(overshoot > 0, "Under-damped should have a slight overshoot");
    assert.ok(overshoot <= 1.6, `Overshoot should be <= 1.5% - 1.6%, got ${overshoot}%`);
  });
});
