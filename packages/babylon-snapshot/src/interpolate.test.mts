import { describe, test, expect } from "vitest";
import { lerp } from "./interpolate.mjs";

describe("lerp", () => {
    test("0 to 0", () => {
        expect(lerp(0, 1, 0.0)).toBe(0);
    });

    test("1 to 1", () => {
        expect(lerp(0, 1, 1.0)).toBe(1);
    });

    test("10 to 10", () => {
        expect(lerp(10, 10, 0.0)).toBe(10);
    });

    test("0 to 1", () => {
        expect(lerp(0, 1, 0.5)).toBe(0.5);
    });

    test("0 to 2", () => {
        expect(lerp(0, 2, 0.5)).toBe(1);
    });

    test("negative amount", () => {
        expect(lerp(0, 2, -0.1)).toBe(-0.2);
    });
});
