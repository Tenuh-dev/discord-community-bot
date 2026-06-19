import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const rest = new REST({ version: "10" }).setToken(config.token);

async function deployCommands(): Promise<void> {
  console.log("🔄 Mendaftarkan slash commands...");

  const commandData = Array.from(commands.values()).map((cmd) => cmd.data.toJSON());

  if (config.clientId) {
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commandData,
    });
    console.log(`✅ ${commandData.length} slash commands berhasil didaftarkan secara global!`);
  } else {
    console.warn("⚠️ DISCORD_CLIENT_ID tidak diset, slash commands tidak didaftarkan.");
  }
}

deployCommands().catch(console.error);
