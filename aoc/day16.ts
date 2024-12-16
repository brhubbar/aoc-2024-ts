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

export default [
  function part1(contents: string): number {
    const move = getMove(contents);
    const turnLeft = (dir: number) => (dir <= 0 ? 3 : dir - 1);
    const turnRight = (dir: number) => (dir >= 3 ? 0 : dir + 1);

    const TURN_COST = 1000;
    const STEP_COST = 1;

    // Each space + direction has a cost to visit.
    // Pick a start space.
    // For each neighboring space, compute the cost to visit.
    // If that cost is less than the space's current spot, move to it and process it
    // from there. If not, stop.

    type Score = number;
    // Score, where from
    type Space = [Score, [Pos1D, Direction]];
    type Spaces = { [idx: Pos1D]: Space[] };
    let spaces: Spaces = {};

    const UNVISITED: Space = [-1, [-1, 0]];

    for (let charIdx = 0; charIdx < contents.length; charIdx++) {
      if (contents[charIdx] == ".") {
        // Mark as unvisited.
        spaces[charIdx] = [UNVISITED, UNVISITED, UNVISITED, UNVISITED];
      }
    }

    let queue: [Pos1D, Direction][] = [];

    // Mark the start point.
    const start = contents.indexOf("S");
    queue[0] = [start, Direction.RIGHT];
    // Annoying that I can't use my enum to index here..
    spaces[start] = [
      UNVISITED,
      [0, [-1, 0]], // Start facing, coming from nowhere.
      UNVISITED,
      UNVISITED,
    ];

    // Mark as the end point.
    const target = contents.indexOf("E");
    // U,R,D,L
    spaces[target] = [UNVISITED, UNVISITED, UNVISITED, UNVISITED];
    debug(target);

    while (queue.length > 0) {
      // for (let i = 0; i < 20; i++) {
      debug(queue);
      let [pos, dir] = queue.pop()!;
      let score = spaces[pos][dir][0];
      debug(`${pos} @ ${dir} for ${score}`);
      // We know we hit with the optimal due to prioritization.
      if (pos == target) {
        debug(spaces);
        return score;
      }

      let neighbor: [Pos1D, Direction] = [move(pos, directions[dir]), dir];
      let newScore = score + STEP_COST;
      let neighborSpace = spaces[neighbor[0]];
      let neighborScore;
      if (neighborSpace != undefined) {
        // Assign a score, check if it's lower than current or unset.
        neighborScore = neighborSpace[neighbor[1]][0];
        if (neighborScore == -1 || newScore < neighborScore) {
          // Save the new score and where we came from.
          spaces[neighbor[0]][neighbor[1]] = [newScore, [pos, dir]];
          queue.push(neighbor);
        }
      }

      neighbor = [pos, turnLeft(dir)];
      newScore = score + TURN_COST;
      neighborSpace = spaces[neighbor[0]];
      if (neighborSpace != undefined) {
        // Assign a score, check if it's lower than current or unset.
        neighborScore = neighborSpace[neighbor[1]][0];
        if (neighborScore == -1 || newScore < neighborScore) {
          // Save the new score and where we came from.
          spaces[neighbor[0]][neighbor[1]] = [newScore, [pos, dir]];
          queue.push(neighbor);
        }
      }

      neighbor = [pos, turnRight(dir)];
      newScore = score + TURN_COST;
      neighborSpace = spaces[neighbor[0]];
      if (neighborSpace != undefined) {
        // Assign a score, check if it's lower than current or unset.
        neighborScore = neighborSpace[neighbor[1]][0];
        if (neighborScore == -1 || newScore < neighborScore) {
          // Save the new score and where we came from.
          spaces[neighbor[0]][neighbor[1]] = [newScore, [pos, dir]];
          queue.push(neighbor);
        }
      }

      // Prioritize (lowest score on the right)
      queue.sort((a, b) => spaces[b[0]][b[1]][0] - spaces[a[0]][a[1]][0]);
    }
    return 0;
  },

  function part2(contents: string): number {
    const move = getMove(contents);
    const turnLeft = (dir: number) => (dir <= 0 ? 3 : dir - 1);
    const turnRight = (dir: number) => (dir >= 3 ? 0 : dir + 1);

    const TURN_COST = 1000;
    const STEP_COST = 1;

    // Each space + direction has a cost to visit.
    // Pick a start space.
    // For each neighboring space, compute the cost to visit.
    // If that cost is less than the space's current spot, move to it and process it
    // from there. If not, stop.

    type Score = number;
    // Score, where from (all equals)
    type Space = [Score, [Pos1D, Direction][]];
    type Spaces = { [idx: Pos1D]: Space[] };
    let spaces: Spaces = {};

    const UNVISITED: Space = [-1, []];

    for (let charIdx = 0; charIdx < contents.length; charIdx++) {
      if (contents[charIdx] == ".") {
        // Mark as unvisited.
        spaces[charIdx] = [UNVISITED, UNVISITED, UNVISITED, UNVISITED];
      }
    }

    let queue: [Pos1D, Direction][] = [];

    // Mark the start point.
    const start = contents.indexOf("S");
    queue[0] = [start, Direction.RIGHT];
    // Annoying that I can't use my enum to index here..
    spaces[start] = [
      UNVISITED,
      [0, []], // Start facing, coming from nowhere.
      UNVISITED,
      UNVISITED,
    ];

    // Mark as the end point.
    const target = contents.indexOf("E");
    // U,R,D,L
    spaces[target] = [UNVISITED, UNVISITED, UNVISITED, UNVISITED];
    debug(target);

    let walkback: [Pos1D, Direction][] = [];

    while (queue.length > 0) {
      // for (let i = 0; i < 20; i++) {
      debug(queue);
      let [pos, dir] = queue.pop()!;
      let score = spaces[pos][dir][0];
      debug(`${pos} @ ${dir} for ${score}`);
      // We know we hit with the optimal due to prioritization.
      if (pos == target) {
        debug(spaces);
        walkback.push([pos, dir]);
        break;
      }

      let neighbor: [Pos1D, Direction] = [move(pos, directions[dir]), dir];
      let newScore = score + STEP_COST;
      let neighborSpace = spaces[neighbor[0]];
      let neighborScore;
      if (neighborSpace != undefined) {
        // Assign a score, check if it's lower than current or unset.
        neighborScore = neighborSpace[neighbor[1]][0];
        if (neighborScore == -1 || newScore < neighborScore) {
          // Save the new score and where we came from.
          spaces[neighbor[0]][neighbor[1]] = [newScore, [[pos, dir]]];
          queue.push(neighbor);
        } else if (newScore == neighborScore) {
          // mark as a from.
          spaces[neighbor[0]][neighbor[1]][1].push([pos, dir]);
        }
      }

      neighbor = [pos, turnLeft(dir)];
      newScore = score + TURN_COST;
      neighborSpace = spaces[neighbor[0]];
      if (neighborSpace != undefined) {
        // Assign a score, check if it's lower than current or unset.
        neighborScore = neighborSpace[neighbor[1]][0];
        if (neighborScore == -1 || newScore < neighborScore) {
          // Save the new score and where we came from.
          spaces[neighbor[0]][neighbor[1]] = [newScore, [[pos, dir]]];
          queue.push(neighbor);
        } else if (newScore == neighborScore) {
          // mark as a from.
          spaces[neighbor[0]][neighbor[1]][1].push([pos, dir]);
        }
      }

      neighbor = [pos, turnRight(dir)];
      newScore = score + TURN_COST;
      neighborSpace = spaces[neighbor[0]];
      if (neighborSpace != undefined) {
        // Assign a score, check if it's lower than current or unset.
        neighborScore = neighborSpace[neighbor[1]][0];
        if (neighborScore == -1 || newScore < neighborScore) {
          // Save the new score and where we came from.
          spaces[neighbor[0]][neighbor[1]] = [newScore, [[pos, dir]]];
          queue.push(neighbor);
        } else if (newScore == neighborScore) {
          // mark as a from.
          spaces[neighbor[0]][neighbor[1]][1].push([pos, dir]);
        }
      }

      // Prioritize (lowest score on the right)
      queue.sort((a, b) => spaces[b[0]][b[1]][0] - spaces[a[0]][a[1]][0]);
    }

    // Walk back along each best path.
    queue = walkback;
    let goodSeats: Pos1D[] = [];

    debug(queue);

    while (queue.length > 0) {
      let [pos, dir] = queue.pop()!;
      goodSeats.push(pos);
      contents = contents.substring(0, pos) + "O" + contents.substring(pos + 1);
      let space = spaces[pos][dir];
      debug(`${pos} @ ${dir} from ${space[1]}`);
      queue.push(...space[1]);
    }
    debug(contents);

    return goodSeats.filter((val, idx) => goodSeats.indexOf(val) == idx).length;
  },
] satisfies Day;

function getNeighbors(idx: Pos1D, moveFn: MoveFn): Pos1D[] {
  let ret: Pos1D[] = [];
  for (let iDir = 0; iDir < directions.length; iDir++) {
    ret.push(moveFn(idx, directions[iDir]));
  }
  return ret;
}
