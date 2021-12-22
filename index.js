#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import cp from "node:child_process";
import readline from "node:readline";

import tempy from "tempy";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import ffmpeg from "ffmpeg-static";

import meow from "meow";

const usage = `
  video-diff-checker - Check diffs of frames in 2 videos

  Usage:
    $ video-diff-checker <fileA> <fileB>

  Options:
    --threshod, -t  Set threshold for diffs (default: 0.1)

  Examples:
    $ pixelmatcher foo.mp4 bar.mp4
    $ pixelmatcher foo.mp4 bar.mp4 -t 0.3

`;

const cli = meow(usage, {
  importMeta: import.meta,
  flags: {
    threshold: {
      type: "number",
      alias: "t",
      default: 0.1,
    },
  },
});

// Parse args
if (cli.input.length !== 2) {
  console.log(usage);
  process.exit(1);
}
const file1 = cli.input[0];
const file2 = cli.input[1];
const threshold = cli.flags.threshold;
console.log(`>> Input: ${file1}, ${file2} (threshold: ${threshold})`);

// Create directories
const framesDir1 = tempy.directory({ prefix: "a" });
const framesDir2 = tempy.directory({ prefix: "b" });

// Extract frames
console.log(`>> Extracting frames from ${file1}...`);
extractFrames(file1, framesDir1);

console.log(`>> Extracting frames from ${file2}...`);
extractFrames(file2, framesDir2);

const frames1 = getFiles(framesDir1);
const frames2 = getFiles(framesDir1);
if (frames1.length !== frames2.length) {
  console.error(`ERROR: Input files have different frame count.`);
  console.error(
    `${file1} has ${frames1.length} frames but ${file2} has ${frames2.length} frames.`
  );
  process.exit(1);
}

// Compare frames
let totalPixels = 0;
let diffPixels = 0;
for (let i = 0; i < frames1.length; i++) {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(
    `>> Comparing frames... ${Math.ceil((i / frames1.length) * 100)}%`
  );

  const framePath1 = path.join(framesDir1, frames1[i]);
  const framePath2 = path.join(framesDir2, frames2[i]);
  const img1 = readFrame(framePath1);
  const img2 = readFrame(framePath2);

  const { width, height } = img1;
  const diffCount = pixelmatch(img1.data, img2.data, null, width, height, {
    threshold,
  });

  totalPixels += width * height;
  diffPixels += diffCount;
}
readline.cursorTo(process.stdout, 0);
console.log(`>> Comparing frames... 100%`);

// Output result
const diffRatio = ((diffPixels / totalPixels) * 100).toFixed(3);
console.log(`\nDiff: ${diffRatio}% (${diffPixels} in ${totalPixels} pixels)\n`);

// Functions
function extractFrames(file, dst) {
  try {
    cp.execSync(`${ffmpeg} -i ${file} ${dst}/%04d.png`, {
      shell: true,
      stdio: "ignore",
    });
  } catch {
    console.error(`ERROR: Failed to extract frames from ${file}`);
    process.exit(1);
  }
}

function getFiles(dir) {
  try {
    return fs.readdirSync(dir);
  } catch {
    console.error(`ERROR: Failed to read directory: ${dir}`);
    process.exit(1);
  }
}

function readFrame(filepath) {
  try {
    return PNG.sync.read(fs.readFileSync(filepath));
  } catch {
    console.log("FAILED");
    console.error(`ERROR: Failed to read image ${filepath}`);
    process.exit(1);
  }
}
