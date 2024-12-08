import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";

import aoc from "./index";
import * as path from "path";

// /aoc
const AOC_FOLDER = __dirname;

describe.each([
  {
    day: 8,
    part: 1,
    expected: 14,
  },
  {
    day: 8,
    part: 2,
    expected: 11387,
  },
  // {
  //   day: 7,
  //   part: 1,
  //   expected: 3749,
  // },
  // {
  //   day: 7,
  //   part: 2,
  //   expected: 11387,
  // },
  // {
  //   day: 6,
  //   part: 1,
  //   expected: 41,
  // },
  // {
  //   day: 6,
  //   part: 2,
  //   expected: 6,
  // },
  // {
  //   day: 5,
  //   part: 1,
  //   expected: 143,
  // },
  // {
  //   day: 5,
  //   part: 2,
  //   expected: 123,
  // },
  // {
  //   day: 4,
  //   part: 1,
  //   expected: 18,
  // },
  // {
  //   day: 4,
  //   part: 2,
  //   expected: 9,
  // },
  // {
  //   day: 3,
  //   part: 1,
  //   expected: 161,
  // },
  // {
  //   day: 3,
  //   part: 2,
  //   expected: 48,
  // },
  // {
  //   day: 2,
  //   part: 1,
  //   expected: 2,
  // },
  // {
  //   day: 2,
  //   part: 2,
  //   expected: 4,
  // },
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
