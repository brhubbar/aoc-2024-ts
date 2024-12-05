import { Day } from ".";
import { debug } from "./utils";

export default [
  function part1(contents: string): number {
    const [rules, updates] = parse(contents);

    let sum = 0;

    checkUpdate: for (let update of updates) {
      // debug(`Evaluating ${update}`);
      // Need to run a recursive sort - for each, check if any to the right of it. This
      // will compare every number to every other number.
      //
      // Running this sort will probably be part two, but for now I'll just exit early
      // on a fail.
      for (let idx in update) {
        if (!checkRight(update, rules, Number(idx))) {
          continue checkUpdate;
        }
      }
      // All of the checks passed.
      let middleIdx = Math.floor(update.length / 2);
      // debug(`Good! Grabbing ${middleIdx}`);
      sum += update[middleIdx];
    }

    return sum;
  },

  function part2(contents: string): number {
    // Check if sorted correctly.
    // If not..
    //  - swap them
    //  - insert the other just to the left?
    //    - Probably this - the rest of the checks had passed to this point.
    //    - Need to continue the check for this same value after the fix is made.
    //    - Need to go back and check the ones that we moved as well...
    //      - I can do this by modifying the for loop index.

    return 0;
  },
] satisfies Day;

function parse(contents: string): number[][][] {
  let [rulesStr, updatesStr] = contents.split("\n\n", 2);
  const rules: number[][] = rulesStr
    .split("\n")
    .map<number[]>((val) => val.split("|").map<number>((val) => Number(val)));
  debug(rules);

  const updates: number[][] = updatesStr
    .split("\n")
    .map<number[]>((val) => val.split(",").map<number>((val) => Number(val)));
  debug(updates);
  return [rules, updates];
}

function checkRight(array: number[], rules: number[][], idx: number): boolean {
  const curr = array[idx];
  // debug(`Checking ${curr}`);

  let validRules = rules.filter((val) =>
    val.includes(curr) ? val : undefined,
  );

  // debug(validRules);
  for (let testIdx = Number(idx) + 1; testIdx < array.length; testIdx++) {
    const testVal = array[testIdx];
    // debug(`against ${testVal}`);
    // Find a rule that has the current value and the value we're testing against.
    let rule: number[] | undefined = validRules.find((val) =>
      val.includes(testVal),
    );
    // debug(rule);
    if (rule == undefined) {
      // We don't care the order, this comparison is good.
      continue;
    }
    if (rule[0] === curr) {
      // This is correctly sorted, the comparison is good.
      continue;
    }
    // This is out of order.
    return false;
  }
  return true;
}
