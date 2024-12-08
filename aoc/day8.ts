import * as math from "mathjs";
import { Day } from "./index";
import { debug } from "./utils";

export default [
  function part1(contents: string): number {
    let width = contents.indexOf("\n") + 1;
    let { complIdx, realIdx } = createConverters(width);

    let frequencies = Array(...contents).filter(
      (val, idx, array) =>
        val != "." && val != "\n" && array.indexOf(val) == idx,
    );

    let antinodesCompl: math.Complex[] = [];
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
          antinodesCompl.push(math.add(right, delta));
          antinodesCompl.push(math.subtract(left, delta));
        }
      }
      debug(antinodesCompl);
    }
    let antinodesReal = antinodesCompl.map<number>((val) => realIdx(val) ?? -1);
    antinodesReal = antinodesReal.filter(
      (val, idx, array) =>
        val >= 0 && val < contents.length && array.indexOf(val) == idx,
    );
    debug(antinodesReal);

    return antinodesReal.length;
  },

  function part2(contents: string): number {
    return 0;
  },
] satisfies Day;

function createConverters(width: number): {
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
      if (idx.re < 0 || idx.re >= width || idx.im < 0) return undefined;
      return idx.re + idx.im * width;
    },
  };
}
