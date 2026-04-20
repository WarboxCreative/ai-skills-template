import chalk from "chalk";
import { loadSkillMetas } from "../skills.js";

export async function runList(): Promise<void> {
  const metas = await loadSkillMetas();

  if (metas.length === 0) {
    console.log(chalk.yellow("No skills available in this package."));
    return;
  }

  console.log(chalk.bold("\nAvailable skills:\n"));
  for (const m of metas) {
    const marker = m.installed ? chalk.green("[x]") : chalk.dim("[ ]");
    const name = chalk.bold(m.name);
    const desc = m.description ? chalk.dim(` — ${m.description}`) : "";
    console.log(`  ${marker} ${name}${desc}`);
  }
  console.log("");
}
