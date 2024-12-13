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
    // stones = blink(stones, 25);
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
    // Order is preserved, so I can process each one separately (since they never join).
    let nSplits = 3;
    let blinkCount = process.env.DEBUG ? 25 : 75;
    let nPredestined = 10;
    // Build a nested array. Doing this before hand so we can fill backward.
    // predestined[stoneValue][nBlinksThusFar - 1]
    let predestined: number[][] = Array(nPredestined)
      .fill(0)
      .map<number[]>(() => Array(blinkCount * nSplits));
    for (let startVal = nPredestined - 1; startVal >= 0; startVal--) {
      let stones = [startVal];
      for (let iBlink = 0; iBlink < blinkCount * nSplits; iBlink++) {
        let newStones: number[] = [];
        for (const stone of stones) {
          newStones.push(...blinkOneStone(stone));
        }
        predestined[startVal][blinkCount - iBlink - 1] = newStones.length;
        stones = newStones;
      }
    }

    // let stones: number[] = JSON.parse(contents);
    let stones: number[] = contents
      .trim()
      .split(/\s+/)
      .map<number>((val) => Number(val));
    // return blink(stones, blinkCount).length;
    // This is better, and won't run into the gc issues I've been battling.
    // https://www.reddit.com/r/adventofcode/comments/1hbm0al/comment/m1hq273/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    return blinkWithPredestined(stones, 0, blinkCount, predestined); // + 216042 + 16907035 + 550518807 = 567641884 <-- too low
  },
] satisfies Day;

function blink(stones: number[], blinkCount: number): number[] {
  for (let iBlink = 0; iBlink < blinkCount; iBlink++) {
    debug(iBlink);
    debug(stones.length);
    let newStones: number[] = [];
    for (const stone of stones) {
      newStones.push(...blinkOneStone(stone));
    }
    stones = newStones;
  }
  return stones;
}

function blinkWithPredestined(
  stones: number[],
  iSkipped: number,
  blinkCount: number,
  predestined: number[][],
): number {
  let nStones = 0;
  for (let iBlink = iSkipped; iBlink < blinkCount + iSkipped; iBlink++) {
    debug(`${iBlink}: ${stones.length} to compute, ${nStones} predetermined`);

    let { stones: newStones, predestinedNStones } = blinkOnceWithPredestined(
      stones,
      iBlink,
      predestined,
    );
    stones = newStones;
    nStones += predestinedNStones;
  }
  nStones += stones.length;
  writeFileSync("./intermediate.txt", JSON.stringify(stones), {
    encoding: "utf-8",
  });

  return nStones;
}

function blinkOnceWithPredestined(
  stones: number[],
  iBlink: number,
  predestined: number[][],
): { stones: number[]; predestinedNStones: number } {
  let nStones = 0;
  let newStones: number[] = [];
  for (const stone of stones) {
    if (stone < predestined.length) {
      nStones += predestined[stone][iBlink];
      continue;
    }
    newStones.push(...blinkOneStone(stone));
  }
  return { stones: newStones, predestinedNStones: nStones };
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
