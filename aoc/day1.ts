import { Day } from ".";

export default [
  function part1(contents: string): number {
    return 1;
  },

  function part2(contents: string): number {
    return JSON.parse(contents);
  },
] satisfies Day;
