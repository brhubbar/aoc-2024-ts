import { Day } from "./index.js";
import { debug } from "./utils.js";

export default [
  function part1(contents: string): number {
    const findMuls = /mul\((\d+),(\d+)\)/g;
    // Match returns a list of all of the matches (thanks to the 'g' flag), but not the
    // groups. Note that a regexp is stateful, so reusing this requires caution.
    // https://stackoverflow.com/a/11477448
    const muls = contents.match(findMuls);
    debug(muls);
    const products: number[] = muls!.map<number>((val) => {
      debug(val);
      let result = val.match(/\d+/g);
      debug(result);
      return result!
        .map<number>((val) => Number(val))
        .reduce((prod, next) => (prod || 1) * next);
    });
    debug(products);
    return products.reduce((sum, next) => sum + next);
  },

  function part2(contents: string): number {
    const findInstructions = /(mul\(\d+,\d+\)|do\(\)|don't\(\))/g;
    const instructions = contents.match(findInstructions);
    debug(instructions);
    let isMul: boolean = true;
    let sum = 0;
    for (const instruction of instructions!) {
      if (instruction == "do()") {
        isMul = true;
        continue;
      } else if (instruction == "don't()") {
        isMul = false;
        continue;
      }

      if (!isMul) continue;

      sum += instruction
        .match(/\d+/g)!
        .map<number>((val) => Number(val))
        .reduce((prod, next) => (prod || 1) * next);
    }
    return sum;
  },
] satisfies Day;
