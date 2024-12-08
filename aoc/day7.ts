import { Day } from "./index.js";
import { debug } from "./utils.js";

// Really proud of this one. At first, I was going to compute the total number of
// permutations and then run each of them individually. However, I realized that'd
// create a lot of duplicate arithmetic, so that was a no-go. Second, using the array to
// pass in the operators came in super handy for part two - I knew it'd either be
// counting how many times you could get the right result, or adding another operator,
// so my implementation made it stupid easy.

export default [
  function part1(contents: string): number {
    // For each value, multiply it or add it to the next value and apply that to the
    // sum. This forks outward.
    // a + b + c + d
    // a + b + c * d
    // a + b * c + d
    // a + b * c * d
    // a * b * c * d
    // a * b * c + d
    // a * b + c * d
    // a * b + c + d
    //
    // a + b
    // a * b
    // (a + b) + c
    // (a + b) * c
    // (a * b) + c
    // (a + b) * c
    let sum = 0;
    for (let equation of contents.split("\n")) {
      if (equation === "") continue;
      // debug(equation);
      let [resultStr, operandsStr] = equation.split(":");
      const result: number = Number(resultStr);
      const operands: number[] = operandsStr
        .trim()
        .split(/\s+/)
        .map<number>((val) => Number(val));
      debug(operands);
      debug(result);
      // Permutations with replacement is n^r; n = 2 (mult, add); one fewer operators
      // than operands.
      let nPermutations = 2 ** (operands.length - 1);
      let results: number[] = [operands.shift()!];
      for (const next of operands) {
        results = permute(results, next, [mult, add]);
      }
      debug(results);
      if (results.includes(result)) sum += result;
      debug("");
    }

    return sum;
  },

  function part2(contents: string): number {
    let sum = 0;
    for (let equation of contents.split("\n")) {
      if (equation === "") continue;
      // debug(equation);
      let [resultStr, operandsStr] = equation.split(":");
      const result: number = Number(resultStr);
      const operands: number[] = operandsStr
        .trim()
        .split(/\s+/)
        .map<number>((val) => Number(val));
      debug(operands);
      debug(result);
      let results: number[] = [operands.shift()!];
      for (const next of operands) {
        results = permute(results, next, [mult, add, concat]);
      }
      debug(results);
      if (results.includes(result)) sum += result;
      debug("");
    }

    return sum;
  },
] satisfies Day;

function permute(
  array: number[],
  nextVal: number,
  operators: Function[],
): number[] {
  let newArray: number[] = [];
  for (const currVal of array) {
    for (const operator of operators) {
      newArray.push(operator(currVal, nextVal));
    }
  }
  return newArray;
}

const mult = (a: number, b: number) => a * b;
const add = (a: number, b: number) => a + b;
const concat = (a: number, b: number) => Number(String(a) + String(b));
