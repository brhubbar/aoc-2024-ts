import aoc from "./index.js";

const DAY: number = JSON.parse(process.argv[2]) ?? 1;

const D1 = aoc(DAY, 1).then((value) => {
  console.log(`Part 1: ${value}`);
});
const D2 = aoc(DAY, 2).then((value) => {
  console.log(`Part 2: ${value}`);
});
