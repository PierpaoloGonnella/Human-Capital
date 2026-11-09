"use strict";
// Loads the inline <script> of index.html into an isolated VM context with a
// minimal DOM stub, so the estimation model can be tested without a browser.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class FakeElement {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.style = {};
    this.textContent = "";
    this.innerHTML = "";
    this.disabled = false;
    this.value = "";
    this.selectedIndex = 0;
    const cls = new Set();
    this.classList = { add: c => cls.add(c), remove: c => cls.delete(c), contains: c => cls.has(c) };
  }
  get options() { return this.children; }
  appendChild(c) { this.children.push(c); return c; }
  append(...cs) { cs.forEach(c => this.appendChild(c)); }
  removeChild(c) { this.children = this.children.filter(x => x !== c); return c; }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type) { (this.listeners[type] || []).forEach(fn => fn({ target: this })); }
  scrollIntoView() {}
}

function loadApp() {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error("inline script not found in index.html");
  const byId = {};
  const document = {
    getElementById: id => (byId[id] ||= new FakeElement("div")),
    createElement: tag => new FakeElement(tag),
    createElementNS: (_ns, tag) => new FakeElement(tag),
  };
  const ctx = {
    document,
    window: { innerWidth: 1280, addEventListener() {} },
    matchMedia: () => ({ matches: false }),
    Intl, Math, setTimeout, clearTimeout,
  };
  vm.createContext(ctx);
  vm.runInContext(m[1], ctx, { filename: "index.html" });
  const api = vm.runInContext(
    "({ROLE_Q,SECTORS,AREAS,SIZES,PT,PERSON_Q,MID,CUT,GRADE_LBL,CDF,TOT,state," +
    "gradeOf,halfWidth,percentileOf,xOf,eur,compute,AX_MIN,AX_MAX,X0,X1," +
    "getN:()=>n,getLast:()=>LAST})", ctx);
  return { ...api, byId, document };
}

module.exports = { loadApp, FakeElement };
