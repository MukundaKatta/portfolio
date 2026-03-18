import { describe, it, expect } from "vitest";
import { Portfolio } from "../src/core.js";
describe("Portfolio", () => {
  it("init", () => { expect(new Portfolio().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Portfolio(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Portfolio(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
