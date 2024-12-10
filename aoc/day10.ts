import * as math from "mathjs";
import { Day } from "./index.js";
import { debug } from "./utils.js";

// I overcomplicated this because I missed the ascending by 1 *only* qualifier, so I
// added a bunch of unnecessary logic to save computation time. Removing it and just
// relying on filtering fixed *everything*.

const directions = [
  math.complex(0, -1), // Up
  math.complex(1, 0), // Right
  math.complex(0, 1), // Down
  math.complex(-1, 0), // Left
];

export default [
  function part1(contents: string): number {
    // 1075 is too high

    // - Start at each 0
    // - Check for consecutive numbers (== or +1)
    // - Fork to those
    // - Kill ones that end
    // - Count the unique 9s reachable
    let { idx1d, idx2d } = createConverters(contents);
    let move = getMove(contents);

    let score = 0;
    for (let startIdx = 0; startIdx < contents.length; startIdx++) {
      const nextTrailhead = contents.indexOf("0", startIdx);
      if (nextTrailhead == -1) break;
      startIdx = nextTrailhead;

      let currentDirection: math.Complex = math.complex(0);
      score += wander(contents, nextTrailhead, currentDirection, move).score;
    }
    return score;
  },

  function part2(contents: string): number {
    let move = getMove(contents);

    let ratings = 0;
    for (let startIdx = 0; startIdx < contents.length; startIdx++) {
      const nextTrailhead = contents.indexOf("0", startIdx);
      if (nextTrailhead == -1) break;
      startIdx = nextTrailhead;

      let currentDirection: math.Complex = math.complex(0);
      ratings += wander(contents, nextTrailhead, currentDirection, move).rating;
    }
    return ratings;
  },
] satisfies Day;

/** Return the indices of reachable 9s found. */
function wander(
  array: string,
  position1d: number,
  currentDirection: math.Complex = math.complex(0),
  moveFn: (idx: number, dxdy: math.Complex) => number | undefined,
): { rating: number; score: number } {
  let occupied: number[] = [];
  let walkers = [position1d];
  let nines: number[] = [];

  while (walkers.length > 0) {
    let position1d = walkers.pop()!;
    // Someone else walked this already.
    // if (occupied.includes(position1d)) continue;
    occupied.push(position1d);
    let altitude = Number(array[position1d]);
    debug(`Walking from ${position1d} at ${altitude}m`);

    for (const direction of directions) {
      // if (direction == math.multiply(currentDirection, -1)) continue;
      let nextPosition1d = moveFn(position1d, direction);
      if (
        // Don't go off map.
        nextPosition1d == undefined ||
        array[nextPosition1d] == "\n"
        // Don't go back where we came from.
        // occupied.includes(nextPosition1d)
      ) {
        continue;
      }

      // Skip big jumps.
      let nextAltitude = Number(array[nextPosition1d]);
      if (
        // Number(nextAltitude) != altitude &&
        Number(nextAltitude) !=
        altitude + 1
      ) {
        continue;
      }

      debug(`Planning to explore ${nextPosition1d} at ${nextAltitude}m`);
      // Based on how it reads, we don't necessarily cut this off, in case the walker
      // can go from a 9 to a 9. However, this fails the test case. We still remove
      // repeats later. *WRONG* the altitude *must* increase. Fixed logic above.
      if (nextAltitude == 9) {
        nines.push(nextPosition1d);
        occupied.push(nextPosition1d);
        continue;
      }
      walkers.push(nextPosition1d);
    }
  }
  let score = nines.filter(
    (val, idx, array) => array.indexOf(val) == idx,
  ).length;
  let rating = nines.length;
  if (process.env.DEBUG ?? process.env.PRINT_TRAILS != undefined) {
    console.log(`Scored ${score}`);
    let trails = "";
    for (let idx = 0; idx < array.length; idx++) {
      if (array[idx] == "\n") {
        trails += "\n";
      } else if (occupied.includes(idx)) {
        trails += array[idx];
      } else trails += ".";
    }
    console.log(trails);
    console.log();
  }
  return {
    score,
    rating,
  };
}

/** Handles top/bottom bounds. Need to check for newlines on side bounds. */
function getMove(
  array: string,
): (idx: number, dxdy: math.Complex) => number | undefined {
  const width = array.indexOf("\n");
  const length = array.length;
  return function move(idx, dxdy) {
    let dx = dxdy.re;
    let dy = dxdy.im;
    if (dy != 0) {
      idx += (width + 1) * dy;
    }
    if (dx != 0) idx += dx;
    if (idx < 0 || idx >= length) return undefined;
    return idx;
  };
}

function createConverters(array: string): {
  idx2d: (idx: number) => math.Complex;
  idx1d: (idx: math.Complex) => number | undefined;
} {
  const width = array.indexOf("\n");
  const length = array.length;
  return {
    idx2d: (idx: number): math.Complex => {
      let j = math.floor(idx / width);
      let i = idx - width * j;
      return math.complex(i, j);
    },
    idx1d: (idx: math.Complex): number | undefined => {
      // Return undefined if the value is out of range of the map.
      if (idx.re < 0 || idx.re >= width - 1 || idx.im < 0) return undefined;
      let ret = idx.re + idx.im * width;
      if (ret >= length - 1) return undefined;
      return ret;
    },
  };
}
