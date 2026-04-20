import chalk from "chalk";
import inquirer from "inquirer";
import {
  installSkill,
  uninstallSkill,
  isInstalled,
  listPackageSkills,
  loadSkillMetas,
  getProjectSkillsDir,
} from "../skills.js";

export async function runAdd(names: string[]): Promise<void> {
  const available = await listPackageSkills();

  if (available.length === 0) {
    console.log(chalk.yellow("No skills available in this package."));
    return;
  }

  if (names.length === 0) {
    await runInteractive();
    return;
  }

  const unknown = names.filter((n) => !available.includes(n));
  if (unknown.length > 0) {
    console.log(chalk.red(`Unknown skill(s): ${unknown.join(", ")}`));
    console.log(chalk.dim("Run `ai-skills-STACK_NAME list` to see available skills."));
    process.exit(1);
  }

  let installed = 0;
  let overwritten = 0;
  for (const name of names) {
    const existed = await isInstalled(name);
    await installSkill(name);
    if (existed) {
      overwritten++;
      console.log(chalk.yellow(`↻ Overwrote ${name}`));
    } else {
      installed++;
      console.log(chalk.green(`✓ Installed ${name}`));
    }
  }

  console.log(
    chalk.dim(
      `\n${installed} installed, ${overwritten} overwritten → ${getProjectSkillsDir()}`,
    ),
  );
}

async function runInteractive(): Promise<void> {
  const metas = await loadSkillMetas();

  const { selected } = await inquirer.prompt<{ selected: string[] }>([
    {
      type: "checkbox",
      name: "selected",
      message: "Select skills to install (space to toggle, enter to confirm):",
      choices: metas.map((m) => ({
        name: m.description ? `${m.name} — ${m.description}` : m.name,
        value: m.name,
        checked: m.installed,
      })),
      pageSize: 15,
    },
  ]);

  const installedNow = metas.filter((m) => m.installed).map((m) => m.name);
  const selectedSet = new Set(selected);
  const installedSet = new Set(installedNow);

  const toInstall = selected.filter((n) => !installedSet.has(n));
  const toRemove = installedNow.filter((n) => !selectedSet.has(n));

  for (const name of toInstall) {
    await installSkill(name);
    console.log(chalk.green(`✓ Installed ${name}`));
  }

  for (const name of toRemove) {
    await uninstallSkill(name);
    console.log(chalk.red(`✗ Removed ${name}`));
  }

  if (toInstall.length === 0 && toRemove.length === 0) {
    console.log(chalk.dim("No changes."));
    return;
  }

  console.log(
    chalk.dim(
      `\n${toInstall.length} installed, ${toRemove.length} removed → ${getProjectSkillsDir()}`,
    ),
  );
}
