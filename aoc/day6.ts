import { Day } from "./index.js";
import { debug } from "./utils.js";

// Upon reading some reddit solutions, I learned that this is a pretty long way to
// implement this. Alternatives ran the whole walk, then put an obstruction in each
// walking location and re-ran the walk to check for loops. My way is *significantly*
// more efficient however, since we don't have to re-compute any steps.

const directions = [
  [0, -1], // Up
  [1, 0], // Right
  [0, 1], // Down
  [-1, 0], // Left
];
const directionIndicators = ["^", ">", "v", "<"];

export default [
  function part1(contents: string): number {
    return takeAWalk(contents, contents.indexOf("^")!);
  },

  function part2(contents: string): number {
    return takeAWalk(contents, contents.indexOf("^")!, undefined, true);
  },
] satisfies Day;

/**
 *
 * @param contents The initial map.
 * @returns The number of distinct spaces occupied, or -1 (if in a loop)
 */
function takeAWalk(
  contents: string,
  startIdx: number,
  startDirection?: number,
  isCreateLoops?: boolean,
): number {
  if (isCreateLoops) debug(startIdx);
  let directionIdx = startDirection ?? 0;
  let array = contents;
  let stopIdx: number | null = startIdx;
  let nSteps = 0;
  let obstructionIdxs: number[] = [];

  while (true) {
    let startIdx = stopIdx!;
    let startArray = array;
    ({ array, stopIdx, nSteps } = findCollision(array, startIdx, directionIdx));
    debug(array);
    if (isCreateLoops) {
      obstructionIdxs = obstructionIdxs.concat(
        checkForLoops(startArray, startIdx, directionIdx, nSteps),
      );
    }
    if (nSteps == Infinity) return -1;
    if (stopIdx == null) {
      // We're done!
      const nLoops = obstructionIdxs
        // Remove duplicates.
        .filter((value, index, array) => array.indexOf(value) === index).length;
      return isCreateLoops ? nLoops : array.match(/(\^|>|v|<)/g)!.length;
    }
    directionIdx = directionIdx >= 3 ? 0 : directionIdx + 1;
  }
}

function checkForLoops(
  array: string,
  start: number,
  directionIdx: number,
  nSteps: number,
): number[] {
  // Kick off a hypothetical walk for every possible collision point. To do this,
  // walk back along the previous direction (relying on wrapping here - we were
  // walking e.g. up, then bumped to right, now bump again to down.)
  let obstructionIdxs: number[] = [];
  let [dx, dy] = directions[directionIdx];
  for (let i = 0; i <= nSteps - 1; i++) {
    // Walk it back. Skip the actual walk we'll take (nSteps).
    let newStopIdx = move(array, start!, dx * i, dy * i);
    let obstructionIdx = move(array, newStopIdx, dx, dy);
    // Can't create a loop by blocking previously covered ground!
    if (array[obstructionIdx] != ".") {
      debug(`Skipping ${newStopIdx} because it's a ${array[obstructionIdx]}`);
      continue;
    }
    // debug(`Trying a loop from ${newStopIdx}`);
    let nSpaces = takeAWalk(
      // Make it an actual obstruction! This is an important detail which.. I may have missed.
      array.substring(0, obstructionIdx) +
        "#" +
        array.substring(obstructionIdx + 1),
      newStopIdx,
      directionIdx >= 3 ? 0 : directionIdx + 1,
      false,
    );
    if (nSpaces == -1) {
      obstructionIdxs.push(obstructionIdx);
      debug(`Found a loop starting from ${newStopIdx}!`);
    }
  }
  // debug("Done with loop tests here");
  return obstructionIdxs;
}

function findCollision(
  array: string,
  start: number,
  directionIdx: number,
): { array: string; stopIdx: number | null; nSteps: number } {
  let idx = start;
  let lastIdx = idx;
  let [dx, dy] = directions[directionIdx];
  for (let nSteps = 0; nSteps < array.length; nSteps++) {
    // Record where they are so we can return that if they collide.
    lastIdx = idx;
    // We're about to move, so we occupied the last space. Skip that if it's already
    // been occupied. Before we mark it, check if we're in a loop.
    if (
      array[lastIdx] == directionIndicators[directionIdx] &&
      lastIdx != start
    ) {
      // We're in a loop!
      return { array, stopIdx: null, nSteps: Infinity };
    }
    if (array[lastIdx] == ".") {
      array =
        array.substring(0, lastIdx) +
        directionIndicators[directionIdx] +
        array.substring(lastIdx + 1);
    }
    idx = move(array, idx, dx, dy);

    // No collision!
    if (idx < 0 || idx >= array.length) return { array, stopIdx: null, nSteps };

    let nextChar = array[idx];
    // No collision!
    if (nextChar == "\n") return { array, stopIdx: null, nSteps };
    // Collided - stopped at...
    if (nextChar == "#") return { array, stopIdx: lastIdx, nSteps };
  }
  throw new Error("This for loop ran way longer than it should have!");
}

function move(array: string, idx: number, dx: number, dy: number): number {
  if (dy != 0) {
    const rowLen = array.indexOf("\n");
    idx += (rowLen + 1) * dy;
  }
  if (dx != 0) idx += dx;
  return idx;
}
