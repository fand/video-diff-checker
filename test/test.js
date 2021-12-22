import cp from "node:child_process";
import path from "node:path";
import test from "tape";

import { fileURLToPath } from "node:url";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const baseDir = path.resolve(dirname, "..");
const cmd = path.join(baseDir, "index.js");

const exec = (...args) => {
  return cp.execFileSync(cmd, args, { cwd: baseDir }).toString();
};

test("0%", async (t) => {
  const output = exec("test/gray.mp4", "test/gray.mp4");
  t.match(output, /Diff: 0.000%/);
});

test("100%", async (t) => {
  const output = exec("test/gray.mp4", "test/red_100.mp4");
  t.match(output, /Diff: 100.000%/);
});

test("50%", async (t) => {
  const output = exec("test/gray.mp4", "test/red_50.mp4");
  t.match(output, /Diff: 50.000%/);
});

test("50% moving", async (t) => {
  const output = exec("test/gray.mp4", "test/red_50_moving.mp4");
  t.match(output, /Diff: 50.000%/);
});

test("10% moving", async (t) => {
  const output = exec("test/gray.mp4", "test/red_10_moving.mp4");
  t.match(output, /Diff: 10.000%/);
});

test("diff", async (t) => {
  exec("test/gray.mp4", "test/red_50_moving.mp4", "-o", "diff.mp4");
  const output = exec("diff.mp4", "test/diff_50_moving.mp4");
  t.match(output, /Diff: 0.000%/);
});
