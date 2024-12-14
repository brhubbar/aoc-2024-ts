import { readFileSync } from "node:fs";
import * as path from "path";
import day1 from "./day1.js";
import day2 from "./day2.js";
import day3 from "./day3.js";
import day4 from "./day4.js";
import day5 from "./day5.js";
import day6 from "./day6.js";
import day7 from "./day7.js";
import day8 from "./day8.js";
import day9 from "./day9.js";
import day10 from "./day10.js";
import day11 from "./day11.js";
import day12 from "./day12.js";
import day13 from "./day13.js";
import day14 from "./day14.js";

// /
const PROJECT_ROOT = path.dirname(import.meta.dirname);
const DEFAULT_INPUTS_FOLDER = path.join(PROJECT_ROOT, "inputs");

export default async function main(day: number, part: number): Promise<number> {
  const input_folder = process.env.INPUTS_FOLDER ?? DEFAULT_INPUTS_FOLDER;

  const file_contents = readFileSync(path.join(input_folder, `day${day}.txt`), {
    encoding: "utf-8",
  });

  return DAYS[day - 1][part - 1](file_contents);
}

export type Day = { (contents: string): number }[];

const DAYS: Day[] = [
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
  day8,
  day9,
  day10,
  day11,
  day12,
  day13,
  day14,
];
