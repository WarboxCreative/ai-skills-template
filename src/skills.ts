import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import type { SkillMeta } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PACKAGE_SKILLS_DIR = path.resolve(__dirname, "..", "skills");

export function getProjectSkillsDir(): string {
  return path.resolve(process.cwd(), ".claude/skills");
}

async function hasSkillFile(dir: string): Promise<boolean> {
  return fs.pathExists(path.join(dir, "SKILL.md"));
}

export async function listPackageSkills(): Promise<string[]> {
  if (!(await fs.pathExists(PACKAGE_SKILLS_DIR))) return [];
  const entries = await fs.readdir(PACKAGE_SKILLS_DIR);
  const skills: string[] = [];
  for (const name of entries) {
    const full = path.join(PACKAGE_SKILLS_DIR, name);
    const stat = await fs.stat(full);
    if (stat.isDirectory() && (await hasSkillFile(full))) skills.push(name);
  }
  return skills.sort();
}

export async function isInstalled(name: string): Promise<boolean> {
  return fs.pathExists(path.join(getProjectSkillsDir(), name, "SKILL.md"));
}

export async function listInstalledSkills(): Promise<string[]> {
  const pkg = await listPackageSkills();
  const installed: string[] = [];
  for (const name of pkg) {
    if (await isInstalled(name)) installed.push(name);
  }
  return installed;
}

export async function installSkill(name: string): Promise<void> {
  const src = path.join(PACKAGE_SKILLS_DIR, name);
  const dest = path.join(getProjectSkillsDir(), name);
  await fs.ensureDir(getProjectSkillsDir());
  await fs.copy(src, dest, { overwrite: true });
}

export async function uninstallSkill(name: string): Promise<void> {
  await fs.remove(path.join(getProjectSkillsDir(), name));
}

export async function readSkillDescription(name: string): Promise<string | undefined> {
  const file = path.join(PACKAGE_SKILLS_DIR, name, "SKILL.md");
  if (!(await fs.pathExists(file))) return undefined;
  const content = await fs.readFile(file, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return undefined;
  const block = match[1];
  const descLine = block
    .split("\n")
    .find((l) => /^description\s*:/.test(l));
  if (!descLine) return undefined;
  const raw = descLine.replace(/^description\s*:\s*/, "").trim();
  return raw.replace(/^["']|["']$/g, "");
}

export async function loadSkillMetas(): Promise<SkillMeta[]> {
  const names = await listPackageSkills();
  const metas: SkillMeta[] = [];
  for (const name of names) {
    metas.push({
      name,
      description: await readSkillDescription(name),
      installed: await isInstalled(name),
    });
  }
  return metas;
}
