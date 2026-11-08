"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadApp } = require("./load-app");

const num = s => Number(String(s).replace(/[^\d]/g, ""));

function rolePts(app, first) {
  const pts = Array(app.ROLE_Q.length).fill(0);
  pts[0] = first;
  return pts;
}

// Fills app.state directly and runs compute(); returns [bMin, mid, bMax, pLo, point, pHi].
function run(app, { role, sec = 1, area = 1, size = 1, pt = 1, pers = 0 }) {
  for (const k of Object.keys(app.state)) delete app.state[k];
  app.ROLE_Q.forEach((q, i) => { app.state["role_" + q.id] = role[i]; });
  Object.assign(app.state, { ctx_sec: sec, ctx_area: area, ctx_size: size, ctx_pt: pt });
  app.PERSON_Q.forEach(q => { app.state["pers_" + q.id] = 0; });
  app.state["pers_" + app.PERSON_Q[0].id] = pers;
  app.compute(false);
  return app.getLast();
}

test("UI starts with calculate disabled and all questions rendered", () => {
  const app = loadApp();
  assert.equal(app.byId.calc.disabled, true);
  assert.equal(app.getN(), 0);
  assert.equal(app.byId.q1.children.length, app.ROLE_Q.length);
  assert.equal(app.byId.q2.children.length, 4);
  assert.equal(app.byId.q3.children.length, app.PERSON_Q.length);
  assert.match(app.byId.proglbl.textContent, new RegExp("0 di " + app.TOT));
});

test("answering every question enables the calculate button", () => {
  const app = loadApp();
  const radios = fs => fs.children.at(-1).children.map(l => l.children[0]);
  for (const c of ["q1", "q3"]) for (const fs of app.byId[c].children) {
    const r = radios(fs);
    r[0].dispatch("change");
    r[1].dispatch("change"); // re-answering must not double count
  }
  assert.equal(app.byId.calc.disabled, true);
  for (const fs of app.byId.q2.children) {
    const sel = fs.children[1].children[0];
    sel.selectedIndex = 1; sel.value = sel.options[1].value;
    sel.dispatch("change");
  }
  assert.equal(app.getN(), app.TOT);
  assert.equal(app.byId.calc.disabled, false);
});

test("neutral profile lands on the role midpoint", () => {
  const app = loadApp();
  const [bMin, mid, bMax, pLo, point, pHi] = run(app, { role: rolePts(app, 40) }); // grade 5
  assert.equal(mid, app.MID[5]);
  assert.ok(Math.abs(bMin - mid * (1 - 0.18)) < 1e-6);
  assert.ok(Math.abs(bMax - mid * (1 + 0.18)) < 1e-6);
  assert.equal(point, mid);
  assert.ok(pLo < point && point < pHi);
  assert.match(app.byId.subline.innerHTML, /Fascia <strong>6 di 15<\/strong>/);
  assert.ok(app.byId.out.classList.contains("on"));
  assert.equal(app.byId.metrics.children.length, 6);
});

test("positive person factors raise the point, capped by tanh at +22%", () => {
  const app = loadApp();
  const pts = rolePts(app, 60);
  const base = run(app, { role: pts })[4];
  const up = run(app, { role: pts, pers: 0.05 })[4];
  const huge = run(app, { role: pts, pers: 10 })[4];
  assert.ok(up > base);
  assert.ok(huge <= base * 1.22 + 1e-6);
  assert.ok(huge > base * 1.21);
});

test("context multipliers compose with a 0.75 exponent", () => {
  const app = loadApp();
  const mid = run(app, { role: rolePts(app, 60), sec: 1.2, area: 1.1, size: 1.05 })[1];
  const expected = app.MID[app.gradeOf(60)] * Math.pow(1.2 * 1.1 * 1.05, 0.75);
  assert.ok(Math.abs(mid - expected) < 1e-6);
});

test("part time scales the band and adds a reproportion notice", () => {
  const app = loadApp();
  const pts = rolePts(app, 60);
  const full = run(app, { role: pts })[1];
  const part = run(app, { role: pts, pt: 0.8 })[1];
  assert.ok(Math.abs(part - full * 0.8) < 1e-6);
  assert.match(app.byId.flags.innerHTML, /Banda riproporzionata/);
  assert.match(app.byId.subline.innerHTML, /riproporzionata/);
});

test("lowest grades are held above the contractual floor", () => {
  const app = loadApp();
  const [bMin, , , pLo, point] = run(app, { role: rolePts(app, 0), area: 0.85, size: 0.85, sec: 0.85, pers: -10 });
  assert.ok(bMin >= 18800 - 1e-6);
  assert.ok(point >= 18800 && pLo >= 18800);
  assert.match(app.byId.flags.innerHTML, /minimo tabellare/);
});

test("senior roles mention the variable component", () => {
  const app = loadApp();
  run(app, { role: rolePts(app, 100) });
  assert.match(app.byId.flags.innerHTML, /tra il 15% e il 35%/);
  assert.ok(num(app.byId.lo.textContent) < num(app.byId.hi.textContent));
});
