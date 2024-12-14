import { Day } from "./index.js";
import { debug } from "./utils.js";

export default [
  function part1(contents: string): number {
    // x = x0 + xd*t
    // y = y0 + yd*t
    // Wraps around xm, xM and ym, yM
    //   - normalize wm to wmN = 0
    //   - wN = w % wMN
    //   - if wN < wm; return wMN + wN; else wN
    //
    //   012345678910
    // 0 ......2..1.
    // 1 ...........
    // 2 1..........
    // 3 .11........
    // 4 .....1.....
    // 5 ...12......
    // 6 .1....1....
    const X_RANGE: [number, number] = process.env.TEST ? [0, 10] : [0, 100];
    const Y_RANGE: [number, number] = process.env.TEST ? [0, 6] : [0, 102];
    const T = 100;
    let quadrants: [number, number, number, number] = [0, 0, 0, 0];
    for (let robotSpec of contents.trim().split("\n")) {
      let [x0, y0, xd, yd] = robotSpec
        .match(/-?\d+/g)!
        .map<number>((val) => Number(val));
      // debug(`(${x0}, ${y0}) moving at ${xd}, ${yd}`);
      let x = wrap(wf(x0, xd, T), ...X_RANGE);
      let y = wrap(wf(y0, yd, T), ...Y_RANGE);
      let quad = quadrant(x, X_RANGE, y, Y_RANGE);
      if (quad != undefined) quadrants[quad] += 1;
    }
    return quadrants.reduce((prod, val) => val * prod);
  },

  function part2(contents: string): number {
    const X_RANGE: [number, number] = process.env.TEST ? [0, 10] : [0, 100];
    const Y_RANGE: [number, number] = process.env.TEST ? [0, 6] : [0, 102];

    let robots: [number, number, number, number][] = [];
    for (let robotSpec of contents.trim().split("\n")) {
      let [x0, y0, xd, yd] = robotSpec
        .match(/-?\d+/g)!
        .map<number>((val) => Number(val));
      robots.push([x0, y0, xd, yd]);
    }

    const includesPos = (
      positions: [number, number][],
      searchPos: [number, number],
    ): boolean => {
      for (const position of positions) {
        if (position[0] == searchPos[0] && position[1] == searchPos[1])
          return true;
      }
      return false;
    };

    const render = (positions: [number, number][]) => {
      // debug(positions);
      let map: string = "";
      for (let yChar = Y_RANGE[0]; yChar <= Y_RANGE[1]; yChar++) {
        for (let xChar = X_RANGE[0]; xChar <= X_RANGE[1]; xChar++) {
          if (includesPos(positions, [xChar, yChar])) {
            map += "#";
            continue;
          }
          map += ".";
        }
        map += "\n";
      }
      return map;
    };

    // Assume.. I guess.. that the tree will occupy the top and bottom center?
    let sFs: number[] = [];
    for (let t = 0; t < 10000; t += 1) {
      let { positions, sF } = simulate(t, robots, X_RANGE, Y_RANGE);
      sFs.push(sF);
      if (sF < 100) {
        console.log(t);
        console.log(render(positions));
      }
    }
    let safest = sFs.indexOf(Math.min(...sFs));
    // debug(safest);
    debug(render(simulate(safest, robots, X_RANGE, Y_RANGE).positions));

    return safest;
  },
] satisfies Day;

function simulate(
  t: number,
  robots: [number, number, number, number][],
  X_RANGE: [number, number],
  Y_RANGE: [number, number],
): { positions: [number, number][]; sF: number } {
  let positions: [number, number][] = [];
  let quadrants: [number, number, number, number] = [0, 0, 0, 0];
  for (const robot of robots) {
    let x = wrap(wf(robot[0], robot[2], t), ...X_RANGE);
    let y = wrap(wf(robot[1], robot[3], t), ...Y_RANGE);
    let quad = quadrant(x, X_RANGE, y, Y_RANGE);
    if (quad != undefined) quadrants[quad] += 1;
    positions.push([x, y]);
  }
  return {
    positions,
    sF: quadrants.reduce((prod, val) => val * prod),
  };
}

const wf = (w0: number, wd: number, t: number) => w0 + wd * t;
const wrap = (w: number, wMin: number, wMax: number) => {
  let wMinN = 0;
  let wMaxN = wMax - wMin;
  // wMaxN goes to wMaxN
  let wN = w % (wMaxN + 1);
  // -1 goes to wMax.
  if (wN < 0) wN = wMaxN + 1 + wN;
  return wN + wMin;
};
const hemi = (w: number, wMin: number, wMax: number) =>
  w - wMin - (wMax - wMin) / 2;

const quadrant = (
  x: number,
  xRange: [number, number],
  y: number,
  yRange: [number, number],
) => {
  x = hemi(x, ...xRange);
  y = hemi(y, ...yRange);
  if (x > 0 && y > 0) return 0;
  else if (x > 0 && y < 0) return 1;
  else if (x < 0 && y < 0) return 2;
  else if (x < 0 && y > 0) return 3;
  // Skip guys on the axes.
  return undefined;
};
