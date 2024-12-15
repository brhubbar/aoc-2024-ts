import * as math from "mathjs";

export function debug(message: any) {
  if (process.env.DEBUG == undefined) {
    return;
  }
  console.log(message);
}

/** Complex x + yj. -1 + 0j if undefined. */
export type Pos2D = math.Complex;
/** Index in the string. -1 if undefined. */
export type Pos1D = number;

export type Idx1DFn = (idx: Pos2D) => Pos1D;
export type Idx2DFn = (idx: Pos1D) => Pos2D;

export function createPositionConverters(array: string): {
  idx1d: Idx1DFn;
  idx2d: Idx2DFn;
} {
  const width = array.indexOf("\n");
  const length = array.length;
  return {
    idx2d: (idx: Pos1D): Pos2D => {
      let undef = math.complex(-1, 0);
      if (idx >= length - 1) return undef;
      let j = math.floor(idx / (width + 1));
      let i = idx - (width + 1) * j;
      let ret = math.complex(i, j);
      if (ret.re < 0 || ret.re >= width || ret.im < 0) return undef;
      return ret;
    },
    idx1d: (idx: Pos2D): Pos1D => {
      let undef = -1;
      // Return undefined if the value is out of range of the map.
      if (idx.re < 0 || idx.re >= width || idx.im < 0) return undef;
      let ret = idx.re + idx.im * (width + 1);
      if (ret >= length - 1) return undef;
      return ret;
    },
  };
}

export type MoveFn = (idx: Pos1D, dxdy: math.Complex) => Pos1D;

export enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

export const directions: math.Complex[] = [
  math.complex(0, -1), // Up
  math.complex(1, 0), // Right
  math.complex(0, 1), // Down
  math.complex(-1, 0), // Left
];

// " "[-1] => undefined, so this works with above.
export function getMove(array: string): MoveFn {
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
