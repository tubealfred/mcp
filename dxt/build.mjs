import { createWriteStream, existsSync } from "node:fs";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import archiver from "archiver";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const stdioDist = resolve(repoRoot, "dist", "index.js");
const staging = resolve(here, "staging");
const distDir = resolve(here, "dist");
const outputFile = resolve(distDir, "tubealfred-youtube.dxt");

async function ensureCleanDir(path) {
  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

async function copyIfExists(source, target) {
  if (!existsSync(source)) {
    return false;
  }

  await copyFile(source, target);

  return true;
}

async function main() {
  if (!existsSync(stdioDist)) {
    throw new Error(`Missing build output: ${stdioDist}\nRun \`pnpm build\` first.`);
  }

  await ensureCleanDir(staging);
  await ensureCleanDir(distDir);

  await mkdir(resolve(staging, "server"), { recursive: true });
  await copyFile(stdioDist, resolve(staging, "server", "index.js"));

  const manifest = await readFile(resolve(here, "manifest.json"), "utf8");
  await writeFile(resolve(staging, "manifest.json"), manifest);

  await copyIfExists(resolve(here, "icon.png"), resolve(staging, "icon.png"));

  await new Promise((resolvePromise, rejectPromise) => {
    const output = createWriteStream(outputFile);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", resolvePromise);
    output.on("error", rejectPromise);
    archive.on("error", rejectPromise);
    archive.pipe(output);
    archive.directory(staging, false);
    archive.finalize();
  });

  process.stdout.write(`Built ${outputFile}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
