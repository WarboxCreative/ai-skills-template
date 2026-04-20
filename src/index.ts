#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { createRequire } from "node:module";
import { runAdd } from "./commands/add.js";
import { runList } from "./commands/list.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };

const program = new Command();

program
  .name("ai-skills-STACK_NAME")
  .description("CLI for distributing Claude Code skills for STACK_NAME projects")
  .version(pkg.version);

program
  .command("add [skills...]")
  .description(
    "Install skill(s) into .claude/skills/. Interactive multi-select if no names given.",
  )
  .action(async (names: string[]) => {
    try {
      await runAdd(names ?? []);
    } catch (err) {
      console.error(chalk.red("Error:"), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List available skills and their installed status.")
  .action(async () => {
    try {
      await runList();
    } catch (err) {
      console.error(chalk.red("Error:"), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parse();
