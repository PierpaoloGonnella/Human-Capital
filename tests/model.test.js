"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadApp } = require("./load-app");

const app = loadApp();

test("grade table is consistent", () => {
  assert.equal(app.MID.length, 15);
  assert.equal(app.CUT.length, 15);
  assert.equal(app.GRADE_LBL.length, 15);
  for (let i = 1; i < 15; i++) {
    assert.ok(app.MID[i] > app.MID[i - 1], "MID must increase");
    assert.ok(app.CUT[i] > app.CUT[i - 1], "CUT must increase");
  }
  assert.equal(app.CUT[14], 100);
});

test("role questions span a range that covers low and high grades", () => {
  let min = 0, max = 0;
  for (const q of app.ROLE_Q) {
    const v = q.opts.map(o => o[1]);
    min += Math.min(...v); max += Math.max(...v);
    assert.ok(q.id && q.label && q.opts.length >= 2);
  }
  assert.ok(min >= 0 && max <= 100, `range ${min}..${max}`);
  assert.ok(app.gradeOf(min) <= 1);
  assert.ok(app.gradeOf(max) >= 13);
});

test("gradeOf maps points to grade boundaries", () => {
  assert.equal(app.gradeOf(0), 0);
  assert.equal(app.gradeOf(8), 0);
  assert.equal(app.gradeOf(9), 1);
  assert.equal(app.gradeOf(50), 6);
  assert.equal(app.gradeOf(51), 7);
  assert.equal(app.gradeOf(100), 14);
  assert.equal(app.gradeOf(150), 14);
  for (let p = 0; p < 100; p++) assert.ok(app.gradeOf(p + 1) >= app.gradeOf(p));
});

test("halfWidth widens with grade", () => {
  assert.equal(app.halfWidth(0), 0.15);
  assert.equal(app.halfWidth(3), 0.15);
  assert.equal(app.halfWidth(4), 0.18);
  assert.equal(app.halfWidth(7), 0.18);
  assert.equal(app.halfWidth(8), 0.22);
  assert.equal(app.halfWidth(10), 0.22);
  assert.equal(app.halfWidth(11), 0.26);
  assert.equal(app.halfWidth(14), 0.26);
});

test("percentileOf hits CDF anchors and clamps at the tails", () => {
  assert.equal(app.percentileOf(10000), 2);
  assert.equal(app.percentileOf(18000), 2);
  assert.equal(app.percentileOf(29500), 50);
  assert.equal(app.percentileOf(35000), 75);
  assert.equal(app.percentileOf(40000), 90);
  assert.equal(app.percentileOf(150000), 99.9);
  assert.equal(app.percentileOf(1e7), 99.9);
});

test("percentileOf is monotonic and log-interpolated", () => {
  let prev = -1;
  for (let v = 18500; v <= 160000; v += 500) {
    const p = app.percentileOf(v);
    assert.ok(p >= prev, `not monotonic at ${v}`);
    prev = p;
  }
  // geometric midpoint between 29500 (50%) and 35000 (75%) -> 62.5%
  assert.equal(app.percentileOf(Math.sqrt(29500 * 35000)), 62.5);
});

test("xOf maps the log axis onto the SVG width and clamps", () => {
  assert.equal(app.xOf(app.AX_MIN), app.X0);
  assert.ok(Math.abs(app.xOf(app.AX_MAX) - app.X1) < 1e-9);
  assert.equal(app.xOf(1000), app.X0);
  assert.ok(Math.abs(app.xOf(1e9) - app.X1) < 1e-9);
  const mid = app.xOf(Math.sqrt(app.AX_MIN * app.AX_MAX));
  assert.ok(Math.abs(mid - (app.X0 + app.X1) / 2) < 1e-9);
});

test("eur rounds to the nearest hundred with Italian grouping", () => {
  const strip = s => s.replace(/\s| | /g, "");
  assert.equal(strip(app.eur(34549)), "34.500");
  assert.equal(strip(app.eur(34550)), "34.600");
  assert.equal(strip(app.eur(120000)), "120.000");
});

test("option lists use sane multipliers", () => {
  for (const list of [app.SECTORS, app.AREAS, app.SIZES]) {
    for (const [label, mul] of list) {
      assert.equal(typeof label, "string");
      assert.ok(mul > 0.5 && mul < 1.6, `${label}: ${mul}`);
    }
  }
  assert.deepEqual([...app.PT.map(p => p[1])], [1, 0.8, 0.6, 0.5]);
  assert.equal(app.TOT, app.ROLE_Q.length + 4 + app.PERSON_Q.length);
});
