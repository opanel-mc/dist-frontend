import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, "data/supported-version-list.json");
const destination = resolve(projectRoot, "public/supported-version-list.json");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);

console.log("Copied data/supported-version-list.json to public/");
