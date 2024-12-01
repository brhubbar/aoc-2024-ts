import { Day } from ".";
import { debug } from "./utils";

export default [
  function part1(contents: string): number {
    let leftList: number[] = [];
    let rightList: number[] = [];
    for (let line of contents.split("\n")) {
      if (line === "") {
        break;
      }
      let [left, right] = line.split("   ", 2);
      leftList.push(JSON.parse(left));
      rightList.push(JSON.parse(right));
      // debug(leftList);
      // debug(rightList);
    }

    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);
    // debug(leftList);
    // debug(rightList);

    let distances: number[] = [];

    for (let idx in leftList) {
      // debug(idx);
      distances.push(Math.abs(leftList[idx] - rightList[idx]));
    }

    return distances.reduce((previous, next, idx) => previous + next);
  },

  function part2(contents: string): number {
    let leftList: number[] = [];
    let rightList: number[] = [];
    for (const line of contents.split("\n")) {
      if (line === "") {
        break;
      }
      let [left, right] = line.split("   ", 2);
      leftList.push(JSON.parse(left));
      rightList.push(JSON.parse(right));
      // debug(leftList);
      // debug(rightList);
    }

    // Count occurrences in left list and in right list.
    const leftOccurrences = countOccurrences(leftList);
    const rightOccurrences = countOccurrences(rightList);
    // debug(leftOccurrences);
    // debug(rightOccurrences);

    let similarity = 0;
    for (const [id, leftCount] of Object.entries(leftOccurrences)) {
      // Similarity score = id * count in right * count in left.
      const rightCount = rightOccurrences[id] ?? 0;
      debug(`id: ${id}, L: ${leftCount}, R: ${rightCount}`);
      similarity += JSON.parse(id) * leftCount * rightCount;
    }
    return similarity;
  },
] satisfies Day;

function countOccurrences(list: number[]): { [id: string]: number } {
  let occurrences: { [id: string]: number } = {};

  while (true) {
    let next = list.pop();
    if (next == undefined) {
      return occurrences;
    }
    if (occurrences[next] == undefined) {
      occurrences[next] = 1;
      continue;
    }
    occurrences[next] += 1;
  }
}
