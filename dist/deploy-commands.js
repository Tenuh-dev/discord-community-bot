"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const commands_1 = require("./commands");
const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.token);
async function deployCommands() {
    console.log("🔄 Mendaftarkan slash commands...");
    const commandData = Array.from(commands_1.commands.values()).map((cmd) => cmd.data.toJSON());
    if (config_1.config.clientId) {
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.clientId), {
            body: commandData,
        });
        console.log(`✅ ${commandData.length} slash commands berhasil didaftarkan secara global!`);
    }
    else {
        console.warn("⚠️ DISCORD_CLIENT_ID tidak diset, slash commands tidak didaftarkan.");
    }
}
deployCommands().catch(console.error);
