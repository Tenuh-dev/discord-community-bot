import { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

import * as ban from "./mod/ban";
import * as unban from "./mod/unban";
import * as kick from "./mod/kick";
import * as timeout from "./mod/timeout";
import * as untimeout from "./mod/untimeout";
import * as clear from "./mod/clear";
import * as warn from "./mod/warn";

export interface Command {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands = new Map<string, Command>([
  ["ban", ban],
  ["unban", unban],
  ["kick", kick],
  ["timeout", timeout],
  ["untimeout", untimeout],
  ["clear", clear],
  ["warn", warn],
]);
