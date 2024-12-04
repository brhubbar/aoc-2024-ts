import { Day } from ".";
import { debug } from "./utils";

export default [
  function part1(contents: string): number {
    // For each X, find touching M's. Record the direction. Check if XMAS in that
    // direction.
    let sum = 0;
    let findX = /X/g;
    for (let i = 0; i < contents.length; i++) {
      let xMatch = findX.exec(contents);
      if (xMatch === null) break;
      debug(xMatch.index);
      let rays = getRays(contents, xMatch.index, 4);
      for (const ray of rays) {
        if (ray === "XMAS") sum += 1;
      }
    }

    return sum;
  },

  function part2(contents: string): number {
    // For each A, find the characters surrounding are m's and s's on opposite corners.
    let sum = 0;
    let findX = /A/g;
    for (let i = 0; i < contents.length; i++) {
      let xMatch = findX.exec(contents);
      if (xMatch === null) break;
      debug(xMatch.index);
      let rays = getRays(contents, xMatch.index, 2);
      if (rays.length != 8) {
        // Can't have an X if there aren't rays in all directions.
        continue;
      }
      debug(rays);

      // Get the diagonals.
      let d1 = rays[1][1] + rays[5][1];
      debug(`d1: ${d1}`);
      if (d1 != "MS" && d1 != "SM") continue;
      let d2 = rays[3][1] + rays[7][1];
      debug(`d2: ${d2}`);
      if (d2 != "MS" && d2 != "SM") continue;
      sum += 1;
    }

    return sum;
  },
] satisfies Day;

/**
 *   5   6   7
 *   4 start 0
 *   3   2   1
 *
 *
 * @param array
 * @param start
 * @param len
 * @returns A list of rays. The indexes illustrated above only applies if all of the
 * rays are returned (bad rays are simply skipped).
 */
function getRays(array: string, start: number, len: number): string[] {
  let rays: string[] = [];
  for (const [dx, dy] of [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ]) {
    let ray = getRay(array, start, dx, dy, len);
    if (ray === null) continue;
    rays.push(ray);
  }
  return rays;
}

/**
 *
 * @param array The array, rows delimited by newlines.
 * @param start First character.
 * @param dx Origin is on the left.
 * @param dy Origin is on the top.
 * @param len How many characters to return.
 *
 * @returns the string or null if not possible (no wrapping support.. I'm sure that'll
 * last).
 */
function getRay(
  array: string,
  start: number,
  dx: number,
  dy: number,
  len: number,
): string | null {
  let string_ = array[start];
  let idx = start;
  for (let charN = 1; charN < len; charN++) {
    if (dy != 0) {
      const rowLen = array.indexOf("\n");
      idx += (rowLen + 1) * dy;
    }
    if (dx != 0) {
      idx += dx;
    }
    if (idx < 0 || idx >= array.length) {
      // Wrapping..
      return null;
    }
    let nextChar = array[idx];
    if (nextChar == "\n") {
      // Wrapping..
      return null;
    }
    string_ = string_ + nextChar;
  }
  return string_;
}
