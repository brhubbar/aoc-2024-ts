import * as math from "mathjs";
import { Day } from "./index.js";
import { debug } from "./utils.js";
import { statSync } from "node:fs";

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
          // @ts-ignore
          let neighboringOccupiedUnvisited: number[] = neighborIdxs.filter(
            (val) =>
              val == undefined ? false : occupiedUnvisitedSpaces.includes(val),
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
            4 -
            neighborIdxs.filter((val) =>
              val == undefined ? false : contents[val] == variety,
            ).length;
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
      // debug(occupiedUnvisitedSpaces);
      let contiguousAreas: number[][] = [];
      let edgePieces: number[][] = [];
      let perimeters: number[] = [];
      while (occupiedUnvisitedSpaces.length > 0) {
        // Process one garden variety.
        let contiguousArea: number[] = [];
        let edgePieces: number[] = [];
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
          // @ts-ignore
          let neighboringOccupiedUnvisited: number[] = neighborIdxs.filter(
            (val) =>
              val == undefined ? false : occupiedUnvisitedSpaces.includes(val),
          );
          // Queue up the unvisited ones for processing.
          queue.push(...neighboringOccupiedUnvisited);
          // Mark these as (to be) visited.
          occupiedUnvisitedSpaces = occupiedUnvisitedSpaces.filter(
            (val) => !neighboringOccupiedUnvisited.includes(val),
          );
          // Add perimeter for any which aren't of the same variety. Subtracting the
          // matching spaces from four accounts for edges.
          let perimeter =
            4 -
            neighborIdxs.filter((val) =>
              val == undefined ? false : contents[val] == variety,
            ).length;

          if (perimeter > 0) {
            edgePieces.push(nextPlotIdx);
          }
        }

        // Check the edges for contiguous edges.
        // Scan for top edges from the top left.
        let scanStart = 0;
        let scanStop = Math.max(...edgePieces);
        let nEdges = 0;
        for (let [moveDir, scanDir] of [
          [1, 2],
          [2, 1],
        ]) {
          let startIdx = scanStart;
          debug(moveDir);
          while (true) {
            // Scan a line.
            let idx = startIdx;
            let isOnLEdge = false;
            let isOnREdge = false;
            while (true) {
              // debug(idx);
              // Look left.
              if (
                !edgePieces.includes(idx) ||
                contents[moveFn(idx, directions[moveDir - 1])] == variety
              ) {
                // Not an LEdge
                isOnLEdge = false;
              } else if (!isOnLEdge) {
                debug("LEdge:");
                debug(
                  contents.substring(0, idx) +
                    " " +
                    contents.substring(idx + 1),
                );
                // We have an LEdge.
                nEdges += 1;
                isOnLEdge = true;
              }

              // Look right.
              if (
                !edgePieces.includes(idx) ||
                contents[moveFn(idx, directions[moveDir + 1])] == variety
              ) {
                // Not an REdge
                isOnREdge = false;
              } else if (!isOnREdge) {
                // We have an REdge.
                debug("REdge:");
                debug(
                  contents.substring(0, idx) +
                    " " +
                    contents.substring(idx + 1),
                );
                nEdges += 1;
                isOnREdge = true;
              }

              // Step.
              idx = moveFn(idx, directions[moveDir]);
              if (idx == -1) break;
            }
            startIdx = moveFn(startIdx, directions[scanDir]);
            if (startIdx > scanStop || startIdx == -1) break;
          }
        }
        contiguousAreas.push(contiguousArea);
        perimeters.push(nEdges);
        debug(`${variety}: ${contiguousArea.length}, ${nEdges}`);
      }
      for (let iArea = 0; iArea < contiguousAreas.length; iArea++) {
        sum += contiguousAreas[iArea].length * perimeters[iArea];
      }
    }
    return sum;
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

function getNeighbors(idx: number, moveFn: MoveFn): (number | undefined)[] {
  let ret: (number | undefined)[] = [];
  for (let iDir = 0; iDir < directions.length; iDir++) {
    let neighborIdx = moveFn(idx, directions[iDir]);
    ret.push(neighborIdx);
  }
  return ret;
}

// " "[-1] => undefined
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
    if (idx < 0 || idx >= length || (idx + 1) % (width + 1) == 0) return -1;
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

type MoveFn = (idx: number, dxdy: math.Complex) => number;
