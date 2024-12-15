import * as math from "mathjs";
import { Day } from "./index.js";
import {
  debug,
  Idx1DFn,
  Idx2DFn,
  Pos1D,
  Pos2D,
  Direction,
  directions,
  createPositionConverters,
  MoveFn,
  getMove,
} from "./utils.js";

const directionChar = ["^", ">", "v", "<"];

export default [
  function part1(contents: string): number {
    let [map, movements] = contents.split("\n\n", 2);
    movements = movements.replaceAll("\n", "");
    debug(map);

    const { idx1d, idx2d } = createPositionConverters(map);
    const move = getMove(map);

    let walls: Pos1D[] = [];
    let boxes: Pos1D[] = [];

    /** Interacts with ^ as globals. Returns the next position. */
    function handleMove(from: Pos1D, dir: math.Complex, moveFn: MoveFn): Pos1D {
      let nextPos = moveFn(from, dir);
      if (walls.includes(nextPos)) {
        // Hit a wall! Do nothing.
        return from;
      }
      let boxIdx = boxes.indexOf(nextPos);
      if (boxIdx != -1) {
        // Run this same suite of tests on this box and move it.
        let oldBoxPos = boxes[boxIdx];
        let newBoxPos = handleMove(oldBoxPos, dir, moveFn);
        // Check if it froze.
        if (newBoxPos == oldBoxPos) return from;
        boxes[boxIdx] = newBoxPos;
      }
      return nextPos;
    }

    const render = (map: string, boxes: Pos1D[], robot: Pos1D) => {
      for (let i = 0; i < map.length; i++) {
        if (map[i] == "#" || map[i] == "\n") continue;
        else if (i == robot)
          map = map.substring(0, i) + "@" + map.substring(i + 1);
        else if (boxes.includes(i))
          map = map.substring(0, i) + "O" + map.substring(i + 1);
        else map = map.substring(0, i) + "." + map.substring(i + 1);
      }
      return map;
    };

    let robot: Pos1D = map.indexOf("@")!;

    for (let idx = 0; idx < map.length; idx++) {
      let char = map[idx];
      switch (char) {
        case "#":
          walls.push(idx);
          break;
        case "O":
          boxes.push(idx);
          break;
        default:
          continue;
      }
    }

    console.log(render(map, boxes, robot));

    for (let moveIdx = 0; moveIdx < movements.length; moveIdx++) {
      let dir = directions[directionChar.indexOf(movements[moveIdx])!];
      robot = handleMove(robot, dir, move);
    }

    console.log(render(map, boxes, robot));

    boxes.sort((a, b) => idx2d(a).im - idx2d(b).im);
    boxes.sort((a, b) => idx2d(a).re - idx2d(b).re);

    let GPS = 0;
    for (let iBox = 0; iBox < boxes.length; iBox++) {
      let boxPos = idx2d(boxes[iBox]);
      debug(`${boxes[iBox]}, ${boxPos}`);
      GPS += boxPos.re + boxPos.im * 100;
    }

    // debug(idx2d(0));
    // debug(idx2d(9));
    // debug(idx2d(10));
    // debug(idx2d(11));

    // debug(idx1d(math.complex(0, 0)));
    // debug(idx1d(math.complex(9, 0)));
    // debug(idx1d(math.complex(-1, 0)));
    // debug(idx1d(math.complex(0, 1)));

    return GPS;
  },

  function part2(contents: string): number {
    let [map, movements] = contents.split("\n\n", 2);
    movements = movements.replaceAll("\n", "");
    debug(map);

    let walls: Pos1D[] = [];
    let boxes: Pos1D[] = [];

    /** Interacts with ^ as globals. Returns the next position. */
    function handleMove(
      from: Pos1D,
      dir: math.Complex,
      moveFn: MoveFn,
      width: number = 1,
      depth: number = 0,
    ): Pos1D {
      // The robot is either
      // []  or  []
      // @        @
      // At box/wall position or at box/wall position + 1.
      //
      // A box is either
      // [][]  or [][]
      // []        []
      // At box/wall position 1 (and hitting only one)
      // or
      // at box/wall position +1 and/or box/wall position -1
      let nextPos = moveFn(from, dir);
      debug(`${from} @ ${dir} to ${nextPos}`);
      switch (width) {
        case 1: {
          if (walls.includes(nextPos) || walls.includes(nextPos - 1)) {
            // Hit a wall! Do nothing.
            return from;
          }
          let boxIdx = boxes.indexOf(nextPos);
          if (boxIdx == -1) boxIdx = boxes.indexOf(nextPos - 1);
          if (boxIdx != -1) {
            // Run this same suite of tests on this box and move it.
            let oldBoxPos = boxes[boxIdx];
            let newBoxPos = handleMove(oldBoxPos, dir, moveFn, 2, depth + 1);
            // Check if it froze.
            if (newBoxPos == oldBoxPos) return from;
            boxes[boxIdx] = newBoxPos;
          }
          return nextPos;
        }
        case 2: {
          // Recursion is killing me here - since a right box can fail somewhere 'early'
          // but after a lot of upstream box checking/movement. My band-aid for this is
          // to save a copy of the previous box positions before I start moving shit,
          // and reverting to it if something freezes.
          let currentBoxes = boxes.slice();
          if (
            // ##
            // []
            walls.includes(nextPos) ||
            //  ##
            // []
            walls.includes(nextPos + 1) ||
            // ##
            //  []
            walls.includes(nextPos - 1)
          ) {
            // Hit a wall! Do nothing.
            return from;
          }

          // [][]
          // []
          let boxIdx = boxes.indexOf(nextPos);
          if (boxIdx != -1) {
            // Run this same suite of tests on this box and move it.
            let oldBoxPos = boxes[boxIdx];
            let newBoxPos = handleMove(oldBoxPos, dir, moveFn, 2, depth + 1);
            // Check if it froze.
            if (newBoxPos == oldBoxPos) {
              // Make sure to undo anything upstream.. I don't think this one needs to
              // be here.
              boxes = currentBoxes;
              return from;
            }
            boxes[boxIdx] = newBoxPos;
          }

          // []
          //  []
          let boxLIdx = -1;
          let boxRIdx = -1;
          if (nextPos - 1 != from) {
            boxLIdx = boxes.indexOf(nextPos - 1);
          }
          //  []
          // []
          if (nextPos + 1 != from) {
            boxRIdx = boxes.indexOf(nextPos + 1);
          }

          if (boxLIdx != -1 && boxRIdx != -1) {
            // Run this same suite of tests on both boxes and move them only if both can
            // move.
            let oldBoxLPos = boxes[boxLIdx];
            let newBoxLPos = handleMove(oldBoxLPos, dir, moveFn, 2, depth + 1);
            // Check if it froze.
            if (newBoxLPos == oldBoxLPos) {
              // Make sure to undo anything upstream.. I don't think this one needs to
              boxes = currentBoxes;
              return from;
            }

            // L box *can* move. Can right?
            let oldBoxRPos = boxes[boxRIdx];
            let newBoxRPos = handleMove(oldBoxRPos, dir, moveFn, 2, depth + 1);
            // Check if it froze.
            if (newBoxRPos == oldBoxRPos) {
              // Make sure to undo anything upstream..
              boxes = currentBoxes;
              return from;
            }

            // Both can move!
            boxes[boxLIdx] = newBoxLPos;
            boxes[boxRIdx] = newBoxRPos;
          } else if (boxLIdx != -1) {
            // left box can move!
            let oldBoxLPos = boxes[boxLIdx];
            let newBoxLPos = handleMove(oldBoxLPos, dir, moveFn, 2, depth + 1);
            // Check if it froze.
            if (newBoxLPos == oldBoxLPos) {
              // Make sure to undo anything upstream.. I don't think this one needs to
              boxes = currentBoxes;
              return from;
            }
            boxes[boxLIdx] = newBoxLPos;
          } else if (boxRIdx != -1) {
            let oldBoxRPos = boxes[boxRIdx];
            let newBoxRPos = handleMove(oldBoxRPos, dir, moveFn, 2, depth + 1);
            // Check if it froze.
            if (newBoxRPos == oldBoxRPos) {
              // Make sure to undo anything upstream.. I don't think this one needs to
              boxes = currentBoxes;
              return from;
            }
            boxes[boxRIdx] = newBoxRPos;
          }
          return nextPos;
        }
      }
      // No collisions!
      return nextPos;
    }

    const render = (map: string, boxes: Pos1D[], robot: Pos1D) => {
      let newMap = "";
      for (let i = 0; i < map.length; i += 1) {
        if (map[i] == "\n") newMap += "\n";
        else if (walls.includes(i) || walls.includes(i - 1)) newMap += "#";
        else if (i == robot) newMap += "@";
        else if (boxes.includes(i)) newMap += "[";
        else if (boxes.includes(i - 1)) newMap += "]";
        else newMap += ".";
      }
      return newMap;
    };

    map = map
      .replaceAll(".", "..")
      .replaceAll("#", "#.")
      .replaceAll("O", "O.")
      .replace("@", "@.");

    let robot: Pos1D = map.indexOf("@")!;

    for (let idx = 0; idx < map.length; idx++) {
      let char = map[idx];
      switch (char) {
        // Objects are double width..
        case "#":
          walls.push(idx);
          break;
        case "O":
          boxes.push(idx);
          break;
        default:
          continue;
      }
    }
    console.log(render(map, boxes, robot));

    const { idx1d, idx2d } = createPositionConverters(
      render(map, boxes, robot),
    );
    const move = getMove(render(map, boxes, robot));

    let a = 0;
    for (let moveIdx = 0; moveIdx < movements.length; moveIdx++) {
      let dir = directions[directionChar.indexOf(movements[moveIdx])!];
      robot = handleMove(robot, dir, move, 1);
      // console.log(moveIdx);
      // console.log(render(map, boxes, robot));
      // for (let i = 0; i < 10000000; i++) {
      //   a += 1;
      // }
      // console.clear();
    }
    console.log(render(map, boxes, robot));
    // console.log(a);
    // debug(idx2d(0));
    // debug(idx2d(19));
    // debug(idx2d(20));
    // debug(idx2d(21));

    // debug(idx1d(math.complex(0, 0)));
    // debug(idx1d(math.complex(9, 0)));
    // debug(idx1d(math.complex(-1, 0)));
    // debug(idx1d(math.complex(0, 1)));

    debug(robot);

    let GPS = 0;
    for (let iBox = 0; iBox < boxes.length; iBox++) {
      let boxPos = idx2d(boxes[iBox]);
      // debug(`${boxes[iBox]}, ${boxPos}`);
      GPS += boxPos.re + boxPos.im * 100;
    }

    // 1530122 too high
    return GPS;
  },
] satisfies Day;
