import { Day } from ".";
import { debug } from "./utils";

export default [
  function part1(contents: string): number {
    let { array, stopIdx } = findCollision(
      contents,
      contents.indexOf("^"),
      0,
      -1,
    );
    let directions = [
      [0, -1], // Up
      [1, 0], // Right
      [0, 1], // Down
      [-1, 0], // Left
    ];
    let directionIdx = 0;
    let dx, dy;
    while (true) {
      [dx, dy] = directions[directionIdx];
      ({ array, stopIdx } = findCollision(array, stopIdx!, dx, dy));
      debug(array);
      if (stopIdx == null) return array.match(/X/g)!.length;
      directionIdx = directionIdx >= 3 ? 0 : directionIdx + 1;
    }
  },

  function part2(contents: string): number {
    return 0;
  },
] satisfies Day;

function findCollision(
  array: string,
  start: number,
  dx: number,
  dy: number,
): { array: string; stopIdx: number | null; nSteps: number } {
  let idx = start;
  let lastIdx = idx;
  for (let nSteps = 1; nSteps < array.length; nSteps++) {
    // Record where they are so we can return that if they collide.
    lastIdx = idx;
    // We're about to move, so we occupied the last space. Skip that if it's already
    // been occupied.
    if (array[lastIdx] != "X") {
      array = array.substring(0, lastIdx) + "X" + array.substring(lastIdx + 1);
    }

    if (dy != 0) {
      const rowLen = array.indexOf("\n");
      idx += (rowLen + 1) * dy;
    }
    if (dx != 0) idx += dx;

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
