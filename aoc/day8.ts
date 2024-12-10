import * as math from "mathjs";
import { Day } from "./index.js";
import { debug } from "./utils.js";

// Note to future self - this is a good one for discussion later; the use of complex
// numbers is interesting and [statistically](https://adventofcode.com/2024/stats) part
// two killed a lot of people.

export default [
  function part1(contents: string): number {
    let width = contents.indexOf("\n") + 1;
    let { complIdx, realIdx } = createConverters(width, contents.length);

    let frequencies = Array(...contents).filter(
      (val, idx, array) =>
        val != "." && val != "\n" && array.indexOf(val) == idx,
    );

    let antinodes: number[] = [];
    for (const frequency of frequencies) {
      // Need all combinations. Another use case for collapsing search.
      //   - Find complIdx of all.
      //   - Find difference between each, being specific about which is 'left' and
      //     'right'
      //   - Find location of antinodes from these
      // a, b, c, d
      // a - b
      //  a + ^
      //  b - ^
      // a - c
      // a - d
      // b - c
      // b - d
      // c - d
      let locationsReal: number[] = [];
      for (let _ = 0; _ < contents.length; _++) {
        let searchStart = (locationsReal.slice(-1)[0] ?? -1) + 1;
        let nextIdx = contents.indexOf(frequency, searchStart);
        if (nextIdx == -1) break;
        locationsReal.push(nextIdx);
      }
      let locationsCompl = locationsReal.map<math.Complex>((val) =>
        complIdx(val),
      );
      debug(locationsCompl);

      while (locationsCompl.length > 0) {
        let left = locationsCompl.pop()!;
        for (let right of locationsCompl) {
          let delta = math.subtract(right, left);
          let antinodeR = realIdx(math.add(right, delta));
          if (antinodeR != undefined) antinodes.push(antinodeR);
          let antinodeL = realIdx(math.subtract(left, delta));
          if (antinodeL != undefined) antinodes.push(antinodeL);
        }
      }
      debug(antinodes);
    }
    antinodes = antinodes.filter(
      (val, idx, array) => array.indexOf(val) == idx,
    );
    // debug(antinodes);
    // for (let node of antinodes) {
    //   contents =
    //     contents.substring(0, node) + "#" + contents.substring(node + 1);
    // }
    // debug(contents);

    return antinodes.length;
  },

  function part2(contents: string): number {
    debug(contents);
    let width = contents.indexOf("\n") + 1;
    let { complIdx, realIdx } = createConverters(width, contents.length);

    let frequencies = Array(...contents).filter(
      (val, idx, array) =>
        val != "." && val != "\n" && array.indexOf(val) == idx,
    );

    let antinodes: number[] = [];
    for (const frequency of frequencies) {
      debug(`Freq: ${frequency}`);
      let locationsReal: number[] = [];
      for (let _ = 0; _ < contents.length; _++) {
        let searchStart = (locationsReal.slice(-1)[0] ?? -1) + 1;
        let nextIdx = contents.indexOf(frequency, searchStart);
        if (nextIdx == -1) break;
        locationsReal.push(nextIdx);
      }
      let locationsCompl = locationsReal.map<math.Complex>((val) =>
        complIdx(val),
      );
      debug(locationsCompl);

      while (locationsCompl.length > 0) {
        let left = locationsCompl.pop()!;
        for (let right of locationsCompl) {
          debug(`Left: ${left}, Right: ${right}`);
          let delta = math.subtract(right, left);
          debug(`Delta: ${delta}`);
          let antinodeRC = right;
          let antinodeRR;
          for (let iNode: number = 0; iNode < contents.length; iNode++) {
            antinodeRR = realIdx(antinodeRC);
            if (antinodeRR == undefined) break;
            antinodes.push(antinodeRR);
            antinodeRC = math.add(antinodeRC, delta);
          }
          let antinodeLC = left;
          let antinodeLR;
          for (let iNode: number = 0; iNode < contents.length; iNode++) {
            antinodeLR = realIdx(antinodeLC);
            if (antinodeLR == undefined) break;
            antinodes.push(antinodeLR);
            antinodeLC = math.subtract(antinodeLC, delta);
          }
        }
      }
    }
    antinodes = antinodes.filter(
      (val, idx, array) => array.indexOf(val) == idx,
    );
    debug(antinodes);
    for (let node of antinodes) {
      contents =
        contents.substring(0, node) + "#" + contents.substring(node + 1);
    }
    debug(contents);

    return antinodes.length;
  },
] satisfies Day;

function createConverters(
  width: number,
  length: number,
): {
  complIdx: (idx: number) => math.Complex;
  realIdx: (idx: math.Complex) => number | undefined;
} {
  return {
    complIdx: (idx: number): math.Complex => {
      let j = math.floor(idx / width);
      let i = idx - width * j;
      return math.complex(i, j);
    },
    realIdx: (idx: math.Complex): number | undefined => {
      // Return undefined if the value is out of range of the map.
      if (idx.re < 0 || idx.re >= width - 1 || idx.im < 0) return undefined;
      let ret = idx.re + idx.im * width;
      if (ret >= length - 1) return undefined;
      return ret;
    },
  };
}
