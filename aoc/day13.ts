import * as math from "mathjs";
import { Day } from "./index.js";
import { debug } from "./utils.js";

export default [
  function part1(contents: string): number {
    // A moves X and Y, costing 3 tokens
    // B moves X and Y, costing 1 token
    // Button pressed <= 100 times
    // Optimal presses to win the prize for each challenge.
    // Need to balance the cost of A vs B.
    // Probably compute common factors of X to AX and BX, Y to AY and BY.

    const COSTS = [3, 1];
    const MAX_BUTTON_PRESSES = 100;
    let cost = 0;
    machineLoop: for (let machineSpec of contents.split("\n\n")) {
      // debug(machineSpec);
      let [aSpec, bSpec, prizeSpec] = machineSpec.split("\n", 3);
      const A = aSpec
        .match(/(?<=(X|Y)\+)(\d+)/g)!
        .map<number>((val) => Number(val));
      const B = bSpec
        .match(/(?<=(X|Y)\+)(\d+)/g)!
        .map<number>((val) => Number(val));
      const Prize = prizeSpec
        .match(/(?<=(X|Y)=)(\d+)/g)!
        .map<number>((val) => Number(val));
      // debug(A);
      // debug(B);
      // debug(Prize);

      // We now have an algebra/optimization problem.
      //
      // (1) xPrize = pressA*xA + pressB*xB
      // (2) yPrize = pressA*yA + pressB*yB
      // (3) Cost = pressA*costA + pressB*costB
      // (4) pressA <= pressMax
      // (5) pressB <= pressMax
      //
      // Compute each case where (1) and (2) are solvable with integer values
      // Compute the cost from there.
      //
      // This seems deterministic - I think I'm missing or overthinking the optimization
      // part of this.
      //                   [xA, xB]      [pressA]      [xPrize]
      //  Ax = b where A = [yA, yB], x = [pressB], b = [yPrize]
      let solution = math.lusolve(
        [
          [A[0], B[0]],
          [A[1], B[1]],
        ],
        Prize,
      );
      let presses: number[] = [];
      for (let val of solution.flat(1)) {
        if (
          // @ts-ignore Not sure how to handle mathjs types...
          Math.abs(math.round(val) - val) > 1e-6 ||
          // @ts-ignore Not sure how to handle mathjs types...
          val > MAX_BUTTON_PRESSES
        ) {
          // Not a valid solution (fractional button press).
          debug(`Skipping`);
          continue machineLoop;
        }
        presses.push(Math.round(Number(val.toString())));
      }
      debug(presses);
      cost += presses[0] * COSTS[0] + presses[1] * COSTS[1];
    }

    return cost;
  },

  function part2(contents: string): number {
    // A moves X and Y, costing 3 tokens
    // B moves X and Y, costing 1 token
    // Button pressed <= 100 times
    // Optimal presses to win the prize for each challenge.
    // Need to balance the cost of A vs B.
    // Probably compute common factors of X to AX and BX, Y to AY and BY.

    const COSTS = [3, 1];
    // const MAX_BUTTON_PRESSES = 100;
    let cost = 0;
    machineLoop: for (let machineSpec of contents.split("\n\n")) {
      // debug(machineSpec);
      let [aSpec, bSpec, prizeSpec] = machineSpec.split("\n", 3);
      const A = aSpec
        .match(/(?<=(X|Y)\+)(\d+)/g)!
        .map<number>((val) => Number(val));
      const B = bSpec
        .match(/(?<=(X|Y)\+)(\d+)/g)!
        .map<number>((val) => Number(val));
      const Prize = prizeSpec
        .match(/(?<=(X|Y)=)(\d+)/g)!
        .map<number>((val) => Number(val) + 10000000000000);
      // debug(A);
      // debug(B);
      // debug(Prize);

      // We now have an algebra/optimization problem.
      //
      // (1) xPrize = pressA*xA + pressB*xB
      // (2) yPrize = pressA*yA + pressB*yB
      // (3) Cost = pressA*costA + pressB*costB
      // (4) pressA <= pressMax
      // (5) pressB <= pressMax
      //
      // Compute each case where (1) and (2) are solvable with integer values
      // Compute the cost from there.
      //
      // This seems deterministic - I think I'm missing or overthinking the optimization
      // part of this.
      //                   [xA, xB]      [pressA]      [xPrize]
      //  Ax = b where A = [yA, yB], x = [pressB], b = [yPrize]
      let solution = math.lusolve(
        [
          [A[0], B[0]],
          [A[1], B[1]],
        ],
        Prize,
      );
      let presses: number[] = [];
      for (let val of solution.flat(1)) {
        // @ts-ignore Not sure how to handle mathjs types...
        if (Math.abs(math.round(val) - val) > 1e-3) {
          // Not a valid solution (fractional button press).
          debug(`Skipping ${val}`);
          continue machineLoop;
        }
        presses.push(Math.round(Number(val.toString())));
      }
      debug(presses);
      cost += presses[0] * COSTS[0] + presses[1] * COSTS[1];
    }

    return cost;
    // 64717993745470 is wrong
  },
] satisfies Day;
