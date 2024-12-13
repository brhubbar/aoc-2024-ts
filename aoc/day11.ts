import { Day } from "./index.js";
import { debug } from "./utils.js";
import { writeFileSync } from "fs";

export default [
  function part1(contents: string): number {
    // Order is preserved, so I can process each one separately (since they never join).
    let stones: number[] = contents
      .trim()
      .split(/\s+/)
      .map<number>((val) => Number(val));
    stones = blink(stones, 25);
    return stones.length;
  },

  function part2(contents: string): number {
    // I can compute deterministic split paths for 0, 1, 2, etc.
    // So I could do that, then drop those out of the system and just add them to the
    // sum.
    //
    // For this to work, I need to know the length after n remaining iterations.
    //
    // Otherwise, I need to do some sort of proof to determine the split path of a
    // number based on its digits. Can I prove how long does it take to start splitting?
    //
    // Doing the above didn't actually work.. unclear if it was due to list growth or
    // lack of garbage collection.
    //
    // Either way, reddit steered me correct - count how many identical stones I have,
    // rather than re-splitting them many, many times.
    //
    // Order is preserved, so I can process each one separately (since they never join).
    let stones: number[] = contents
      .trim()
      .split(/\s+/)
      .map<number>((val) => Number(val));
    let sensibleStones: StoneMap = {};
    for (const stone of stones) {
      sensibleStones[stone] = (sensibleStones[stone] ?? 0) + 1;
    }
    sensibleStones = blinkEfficiently(sensibleStones, 75);
    let nStones = 0;
    for (const stone in sensibleStones) {
      nStones += sensibleStones[stone];
    }
    return nStones;
  },
] satisfies Day;

function blink(stones: number[], blinkCount: number): number[] {
  for (let iBlink = 0; iBlink < blinkCount; iBlink++) {
    debug(`Blink ${iBlink}, ${stones.length} stones`);
    let newStones: number[] = [];
    for (const stone of stones) {
      newStones.push(...blinkOneStone(stone));
    }
    stones = newStones;
  }
  return stones;
}

function blinkEfficiently(stones: StoneMap, blinkCount: number): StoneMap {
  for (let iBlink = 0; iBlink < blinkCount; iBlink++) {
    debug(`Blink ${iBlink}, ${Object.keys(stones).length} unique stones`);

    let newStones: StoneMap = {};

    for (const stone in stones) {
      let stoneMultiplier = stones[stone];
      let newEngravings = blinkOneStone(Number(stone));
      for (const newStone of newEngravings) {
        newStones[newStone] = (newStones[newStone] ?? 0) + stoneMultiplier;
      }
    }

    stones = newStones;
  }
  return stones;
}

function blinkOneStone(stone: number): number[] {
  if (stone == 0) {
    return [1];
  } else if (`${stone}`.length % 2 == 0) {
    let nDigits = `${stone}`.length;
    let newStones = [
      Number(`${stone}`.slice(0, nDigits / 2)),
      Number(`${stone}`.slice(nDigits / 2)),
    ];
    // debug(`Splitting ${stone} into ${newStones}`);
    return newStones;
  } else {
    return [stone * 2024];
  }
}

type StoneMap = { [engraving: number]: number };
