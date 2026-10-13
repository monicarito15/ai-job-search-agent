import fs from "fs";
import path from "path";
import process from "process";


export async function readCV(): Promise<string> {
  const cvPath = path.join(process.cwd(), "cv.md");
  return fs.readFileSync(cvPath, "utf-8");
}
