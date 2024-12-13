import * as math from "mathjs";
import { Day } from "./index.js";
import { debug } from "./utils.js";

const directions = [
  math.complex(0, -1), // Up
  math.complex(1, 0), // Right
  math.complex(0, 1), // Down
  math.complex(-1, 0), // Left
];

export default [
  function part1(contents: string): number {
    // - For each unique plant type
    // - Find all locations
    // - Pick a location and move it to a FIFO.
    //    - pop it to 'area 1' list
    //    - check neighbors
    //    - move neighbors in the mask to the fifo
    //    - add perimeter for neighbors outside the mask (or no neighbor on edges)
    let gardenVarieties: string[] = [];
    for (let iChar = 0; iChar < contents.length; iChar++) {
      let char = contents[iChar];
      if (gardenVarieties.includes(char) || char == "\n") continue;
      gardenVarieties.push(char);
    }
    debug(gardenVarieties);

    const moveFn = getMove(contents);

    let sum = 0;
    for (const variety of gardenVarieties) {
      // Find all locations.
      let occupiedUnvisitedSpaces: number[] = scanFor(variety, contents);
      debug(occupiedUnvisitedSpaces);

      let contiguousAreas: number[][] = [];
      let perimeters: number[] = [];

      while (occupiedUnvisitedSpaces.length > 0) {
        // Process one garden variety.
        let contiguousArea: number[] = [];
        let perimeter = 0;
        // Pick a location and move it into a queue)
        let queue: number[] = [occupiedUnvisitedSpaces.pop()!];
        while (queue.length > 0) {
          // Process one contiguous area.
          // Pop the front of the fifo
          let nextPlotIdx = queue.pop()!;
          // Register as part of a contiguous area (for area calculation).
          contiguousArea.push(nextPlotIdx);
          // Find the neighbors.
          let neighborIdxs = getNeighbors(nextPlotIdx, moveFn);
          // Check if these neighbors are in an unvisited part of the garden.
          let neighboringOccupiedUnvisited: number[] = neighborIdxs.filter(
            (val) => occupiedUnvisitedSpaces.includes(val),
          );
          // Queue up the unvisited ones for processing.
          queue.push(...neighboringOccupiedUnvisited);
          // Mark these as (to be) visited.
          occupiedUnvisitedSpaces = occupiedUnvisitedSpaces.filter(
            (val) => !neighboringOccupiedUnvisited.includes(val),
          );
          // Add perimeter for any which aren't of the same variety. Subtracting the
          // matching spaces from four accounts for edges.
          perimeter +=
            4 - neighborIdxs.filter((val) => contents[val] == variety).length;
        }
        contiguousAreas.push(contiguousArea);
        perimeters.push(perimeter);
      }
      debug(`${variety}: ${contiguousAreas}, ${perimeters}`);
      for (let iArea = 0; iArea < contiguousAreas.length; iArea++) {
        sum += contiguousAreas[iArea].length * perimeters[iArea];
      }
    }

    return sum;
  },

  function part2(contents: string): number {
    return 0;
  },
] satisfies Day;

function scanFor(variety: string, array: string): number[] {
  let allIdxs: number[] = [];
  for (let startIdx = 0; startIdx < array.length; startIdx++) {
    let foundIdx = array.indexOf(variety, startIdx);
    if (foundIdx == -1) break;
    allIdxs.push(foundIdx);
    startIdx = foundIdx;
  }
  return allIdxs;
}

function getNeighbors(idx: number, moveFn: MoveFn): number[] {
  let ret: number[] = [];
  for (let iDir = 0; iDir < directions.length; iDir++) {
    let neighborIdx = moveFn(idx, directions[iDir]);
    if (neighborIdx == undefined) continue;
    ret.push(neighborIdx);
  }
  return ret;
}

/** Return list of lists of contiguous indices in the direction specified */
function scan(
  array: string,
  searchVal: string,
  scanDir: math.Complex,
  nextScanDir: math.Complex,
): number[][] {
  let moveFn = getMove(array);

  let idx: number | undefined = 0;
  let lines: number[][] = [];
  while (true) {
    if (idx == undefined) {
      // We've made it to the end.
      return lines;
    }
    lines.push(...scanLine(array, searchVal, idx, scanDir));
    idx = moveFn(idx, nextScanDir);
  }
}

function scanLine(
  array: string,
  searchVal: string,
  startIdx: number,
  scanDir: math.Complex,
): number[][] {
  let moveFn = getMove(array);

  let idx: number | undefined = startIdx;
  let lines: number[][] = [[]];
  while (true) {
    if (idx == undefined) {
      // We've made it to the end.
      if (lines[lines.length - 1].length == 0) {
        // Don't include any empty lists.
        lines.pop();
      }
      return lines;
    }
    // debug(`${idx}: ${array[idx]} (${searchVal})`);
    if (array[idx] == searchVal) {
      lines[lines.length - 1].push(idx);
    } else if (lines[lines.length - 1].length > 0) {
      lines.push([]);
    }
    idx = moveFn(idx, scanDir);
  }
}

function getMove(array: string): MoveFn {
  const width = array.indexOf("\n");
  const length = array.length;
  return function move(idx, dxdy) {
    let dx = dxdy.re;
    let dy = dxdy.im;
    if (dy != 0) {
      idx += (width + 1) * dy;
    }
    if (dx != 0) idx += dx;
    if (idx < 0 || idx >= length || (idx + 1) % (width + 1) == 0)
      return undefined;
    return idx;
  };
}

type MoveFn = (idx: number, dxdy: math.Complex) => number | undefined;
