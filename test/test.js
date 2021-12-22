import cp from "node:child_process";
import path from "node:path";
import test from "tape";

import { fileURLToPath } from "node:url";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const baseDir = path.resolve(dirname, "..");
const cmd = path.join(baseDir, "index.js");

const exec = (...args) => {
  const proc = cp.spawnSync(cmd, args);
  return proc.stdout.toString();
};

test("CLI help", async (t) => {
  const output = exec("-h");
  t.equals(output.trim(), exec("--help").trim());
  t.match(output, /Usage/);
  t.match(output, /Example/);
});

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
