import { readFile, readFileSync } from "node:fs";
import * as path from "path";
import day1 from "./day1";
import day2 from "./day2";
import day3 from "./day3";
import day4 from "./day4";
import day5 from "./day5";
import day6 from "./day6";
import day7 from "./day7";

// /
const PROJECT_ROOT = path.dirname(__dirname);
const DEFAULT_INPUTS_FOLDER = path.join(PROJECT_ROOT, "inputs");

export default async function main(day: number, part: number): Promise<number> {
  const input_folder = process.env.INPUTS_FOLDER ?? DEFAULT_INPUTS_FOLDER;

  const file_contents = readFileSync(path.join(input_folder, `day${day}.txt`), {
    encoding: "utf-8",
  });

  return DAYS[day - 1][part - 1](file_contents);
}

export type Day = { (contents: string): number }[];

const DAYS: Day[] = [day1, day2, day3, day4, day5, day6, day7];
