import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";

import aoc from "./index";
import * as path from "path";

// /aoc
const AOC_FOLDER = __dirname;

describe.each([
  {
    day: 2,
    part: 1,
    expected: 2,
  },
  {
    day: 2,
    part: 2,
    expected: 4,
  },
  // {
  //   day: 1,
  //   part: 1,
  //   expected: 11,
  // },
  // {
  //   day: 1,
  //   part: 2,
  //   expected: 31,
  // },
])("Day $day part $part", ({ day, part, expected }) => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("INPUTS_FOLDER", path.join(AOC_FOLDER, "test_inputs"));
    vi.stubEnv("DEBUG", "1");
  });

  it(`should return ${expected}`, async () => {
    const actual = await aoc(day, part);

    expect(actual).toEqual(expected);
  });
});
