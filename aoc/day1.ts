import { Day } from "./index.js";
import { debug } from "./utils.js";

export default [
  function part1(contents: string): number {
    // Check out https://www.reddit.com/r/adventofcode/comments/1h3vp6n/comment/lztvrzf/
    // for a more elegant way to do this.
    let [leftList, rightList] = parse(contents);

    // Sort requires a function to run the comparison.
    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);
    debug(leftList);
    debug(rightList);

    let distances: number[] = [];

    distances = leftList.map((val, idx) => Math.abs(val - rightList[idx]));
    return distances.reduce((previous, next) => previous + next);
  },

  function part2(contents: string): number {
    let [leftList, rightList] = parse(contents);

    // Count occurrences in left list and in right list.
    const leftOccurrences = countOccurrences(leftList);
    const rightOccurrences = countOccurrences(rightList);
    debug(leftOccurrences);
    debug(rightOccurrences);

    let similarity = 0;
    for (const [id, leftCount] of Object.entries(leftOccurrences)) {
      // Similarity score = id * count in right * count in left.
      const rightCount = rightOccurrences[id] ?? 0;
      debug(`id: ${id}, L: ${leftCount}, R: ${rightCount}`);
      similarity += Number(id) * leftCount * rightCount;
    }
    return similarity;
  },
] satisfies Day;

function parse(contents: string): number[][] {
  let leftList: number[] = [];
  let rightList: number[] = [];
  for (let line of contents.split("\n")) {
    if (line === "") {
      break;
    }
    let [left, right] = line.split(/\s+/, 2);
    leftList.push(Number(left));
    rightList.push(Number(right));
  }
  return [leftList, rightList];
}

function countOccurrences(list: number[]): { [id: string]: number } {
  let occurrences: { [id: string]: number } = {};

  // Equivalent to `for (const val of list) {...}`
  list.map((val) => {
    occurrences[val] = (occurrences[val] ?? 0) + 1;
  });
  return occurrences;
}
