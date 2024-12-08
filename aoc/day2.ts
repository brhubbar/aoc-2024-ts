import { Day } from "./index.js";
import { debug } from "./utils.js";

export default [
  function part1(contents: string): number {
    let [reports, diffs] = parse(contents);

    let ret = 0;
    for (const idx in diffs) {
      let diff_ = diffs[idx];
      if (check(diff_) === "-1") {
        ret += 1;
      }
    }
    return ret;
  },

  function part2(contents: string): number {
    let [reports, diffs] = parse(contents);

    let ret = 0;
    for (const idx in diffs) {
      let diff_ = diffs[idx];
      let firstBad = check(diff_);
      if (firstBad === "-1") {
        ret += 1;
        continue;
      }

      debug(`===== ${reports[idx]} failed with a diff ${diff_}.`);

      for (const i in reports[idx]) {
        let newReport = [...reports[idx]];
        newReport.splice(Number(i), 1);
        debug(newReport);
        let newDiff = diff(newReport);
        if (check(newDiff) === "-1") {
          ret += 1;
          break;
        }
      }
      // // debug(`Dropping ${firstBad} and trying again`);
      // let dropped = reports[idx].splice(Number(firstBad), 1);
      // diff_ = diff(reports[idx]);
      // if (check(diff_) === "-1") {
      //   debug(`${reports[idx]} passed with a diff ${diff_}`);
      //   ret += 1;
      //   continue;
      // }

      // // debug(`${reports[idx]} failed with a diff ${diff_}`);

      // reports[idx].splice(Number(firstBad), 1, ...dropped);
      // diff_ = diff(reports[idx]);
      // if (check(diff_) === "-1") {
      //   debug(`${reports[idx]} passed with a diff ${diff_}`);
      //   ret += 1;
      //   continue;
      // }

      // debug(`It never passed`);
    }
    return ret;
  },
] satisfies Day;

function check(diff_: number[]): string {
  // Check that all are the same sign.
  const checkSign = Math.sign(diff_[0]);
  for (const idx in diff_) {
    const val = diff_[idx];
    if (Math.sign(val) != checkSign) return idx;
    if (Math.abs(val) < 1 || Math.abs(val) > 3) return idx;
  }
  return "-1";
}

function diff(array: number[]): number[] {
  let ret = array.map((val, idx) => array[idx + 1] - val);
  ret.pop();
  return ret;
}

function parse(contents: string): number[][][] {
  let reports: number[][] = [];
  let diffs: number[][] = [];
  for (let line of contents.split("\n")) {
    if (line === "") {
      break;
    }
    const report = line.split(/\s+/).map((val) => Number(val));
    reports.push(report);
    diffs.push(diff(report));
  }
  // debug(reports);
  // debug(diffs);
  return [reports, diffs];
}
