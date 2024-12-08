import { Day } from "./index.js";
import { debug } from "./utils.js";

export default [
  function part1(contents: string): number {
    const [rules, updates] = parse(contents);

    let sum = 0;

    checkUpdate: for (let update of updates) {
      debug(`Evaluating ${update}`);
      // Need to run a recursive sort - for each, check if any to the right of it. This
      // will compare every number to every other number.
      //
      // Running this sort will probably be part two, but for now I'll just exit early
      // on a fail.
      for (let idx in update) {
        if (checkRight(update, rules, Number(idx)) !== -1) {
          // This check failed.
          debug("Failed");
          continue checkUpdate;
        }
      }
      debug("Passed");
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
    //      - By doing this, I don't need to also continue the check since the previous
    //        current value will get rechecked since it's still to the right.
    const [rules, updates] = parse(contents);

    let sum = 0;

    for (let update of updates) {
      debug(`Evaluating ${update}`);
      // Need to run a recursive sort - for each, check if any to the right of it. This
      // will compare every number to every other number.
      //
      // Running this sort will probably be part two, but for now I'll just exit early
      // on a fail.

      // Doing this instead of idx in update lets me modify the idx to step the loop
      // back and recheck stuff. It also lets me safely modify update since I'm not
      // directly iterating over it.
      let isNeededSorting = false;

      for (let idx = 0; idx < update.length; idx++) {
        const toMoveIdx = checkRight(update, rules, idx);
        if (toMoveIdx === -1) {
          // This value is placed correctly.
          continue;
        }

        // debug(`Sort prior: ${update}`);
        let moving = update.splice(toMoveIdx, 1);
        update = update.slice(0, idx).concat(moving, update.slice(idx));
        // debug(`Sort result: ${update}`);
        // Move back to re-check this index (which is now the value that moved)
        idx -= 1;
        // Mark this as sorted so we can save the value.
        isNeededSorting = true;
      }

      debug(`Passing as ${update} ${isNeededSorting ? "sorted" : "unsorted"}`);
      if (!isNeededSorting) {
        // This update was already sorted, we don't care about this update.
        continue;
      }
      // All of the checks passed.
      let middleIdx = Math.floor(update.length / 2);
      // debug(`Good! Grabbing ${middleIdx}`);
      sum += update[middleIdx];
    }

    return sum;
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

/**
 *
 * @param array
 * @param rules
 * @param idx
 * @returns Index of the failing value.
 */
function checkRight(array: number[], rules: number[][], idx: number): number {
  const curr = array[idx];
  debug(`Checking ${curr}`);

  let validRules = rules.filter((val) =>
    val.includes(curr) ? val : undefined,
  );

  debug(validRules);
  for (let testIdx = idx + 1; testIdx < array.length; testIdx++) {
    const testVal = array[testIdx];
    debug(`against ${testVal}`);
    // Find a rule that has the current value and the value we're testing against.
    let rule: number[] | undefined = validRules.find((val) =>
      val.includes(testVal),
    );
    debug(rule);
    if (rule == undefined) {
      // We don't care the order, this comparison is good.
      continue;
    }
    if (rule[0] === curr) {
      // This is correctly sorted, the comparison is good.
      continue;
    }
    // This is out of order.
    return testIdx;
  }
  // All good!
  return -1;
}
