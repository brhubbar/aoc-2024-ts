import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";

import aoc from "./index.ts";
import * as path from "path";

// /aoc
const AOC_FOLDER = __dirname;

describe.each([
  {
    day: 1,
    part: 1,
    expected: 1,
  },
  {
    day: 1,
    part: 2,
    expected: 3,
  },
])("Day $day part $part", ({ day, part, expected }) => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("INPUTS_FOLDER", path.join(AOC_FOLDER, "test_inputs"));
  });

  it(`should return ${expected}`, async () => {
    const actual = await aoc(day, part);

    expect(actual).toEqual(expected);
  });
});
