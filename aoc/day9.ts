import { Day } from "./index.js";
import { debug } from "./utils.js";

// Note to self - this is an interesting one to discuss because most people built out a
// representation of the entire file system (either following the example, with unicode
// characters, or with a list) whereas I ran the more memory-efficient approach of
// building the checksum as I went and forgetting where things had been moved to. Not
// necessarily faster since I didn't take the time to block indices, but probably more
// scalable.

export default [
  function part1(contents: string): number {
    // File sizes are even; space sizes are odd.
    // Read from the start:
    //   - Calculate checksum of existing files
    //   - Find gap size
    // Read from the end:
    //   - Fill gaps
    //   - Keep track of partial blocks from files.
    //   - Calculate checksums
    let compressIdx = contents.length; // We -2 right away in the compression alg.
    let remainingBlocks = 0;
    let checksum = 0;
    let blockIdx = 0;
    let fs = "";
    // The ids count up from the bottom. Probably what's going to change on part 2.
    const getFileId = (mapIdx: number): number => mapIdx / 2;
    compressor: for (let mapIdx = 0; mapIdx < contents.length; mapIdx += 2) {
      if (mapIdx >= compressIdx) {
        // This is the final step. This file was partially compressed; finish counting
        // what hasn't been compressed yet.
        for (let _ = 0; _ < remainingBlocks; _++) {
          const fileId = getFileId(mapIdx);
          checksum += fileId * blockIdx;
          blockIdx++;
          fs += fileId;
        }
        break compressor;
      }
      // Checksum the file which is already compressed.
      const fileSize = Number(contents[mapIdx]);
      const fileId = getFileId(mapIdx);
      debug(`Processing File ${fileId}`);
      for (let _ = 0; _ < fileSize; _++) {
        checksum += fileId * blockIdx;
        blockIdx++;
        fs += fileId;
      }
      // Fill the gap.
      let gapSize = Number(contents[mapIdx + 1]);
      while (gapSize > 0) {
        if (remainingBlocks <= 0) {
          compressIdx -= 2;
          if (compressIdx <= mapIdx) break compressor;
          remainingBlocks = Number(contents[compressIdx]);
        }
        const fileId = getFileId(compressIdx);
        debug(`Compressing File ${fileId}`);
        checksum += fileId * blockIdx;
        blockIdx++;
        gapSize--;
        remainingBlocks--;
        fs += fileId;
      }
    }
    debug(fs);
    debug("0099811188827773336446555566..............");
    return checksum;
  },

  function part2(contents: string): number {
    // File sizes are even; space sizes are odd.
    // Read from the end:
    //   - Find gap and move, or leave
    //   - Compute block idx
    //   - Calc checksum
    let remainingBlocks = 0;
    let checksum = 0;
    // Cache partially filled blocks.
    let blocksOccupiedAt: { [mapIdx: number]: number } = {};
    const getFileId = (mapIdx: number): number => mapIdx / 2;
    const getBlockIdx = (idx: number): number => {
      let blockIdx = 0;
      for (let fileOrGapIdx = 0; fileOrGapIdx < idx; fileOrGapIdx++) {
        blockIdx += Number(contents[fileOrGapIdx]);
      }
      // Account for already filled blocks.
      blockIdx += blocksOccupiedAt[idx] ?? 0;
      return blockIdx;
    };
    compressor: for (
      let mapIdx = contents.length - 2;
      mapIdx >= 0;
      mapIdx -= 2
    ) {
      // Move the file?
      const fileSize = Number(contents[mapIdx]);
      const fileId = getFileId(mapIdx);
      debug(`Processing file ${fileId} (${fileSize} blocks)`);
      for (let gapIdx = 1; gapIdx < mapIdx; gapIdx += 2) {
        const alreadyOccupiedBlocks = blocksOccupiedAt[gapIdx] ?? 0;
        const gapSize = Number(contents[gapIdx]) - alreadyOccupiedBlocks;
        debug(`Gap ${gapIdx} has ${gapSize} blocks left`);
        // debug(blocksOccupiedAt);
        if (fileSize > gapSize) continue;
        // 'Move' the file and compute its checksum (it's now fixed in place).
        let blockIdx = getBlockIdx(gapIdx);
        for (let fileBlockIdx = 0; fileBlockIdx < fileSize; fileBlockIdx++) {
          checksum += fileId * blockIdx;
          blockIdx++;
        }
        blocksOccupiedAt[gapIdx] = alreadyOccupiedBlocks + fileSize;
        continue compressor;
      }
      // No blocks found.
      let blockIdx = getBlockIdx(mapIdx);
      for (let fileBlockIdx = 0; fileBlockIdx < fileSize; fileBlockIdx++) {
        checksum += fileId * blockIdx;
        blockIdx++;
      }
    }
    debug("0099811188827773336446555566..............");
    return checksum;
  },
] satisfies Day;
