import { Client, Events, Interaction } from "discord.js";
import { commands } from "../commands";

export function registerInteractionCreateEvent(client: Client): void {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: "❌ Perintah tidak ditemukan.",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`[Command Error] /${interaction.commandName}:`, err);
      const errorMsg = "❌ Terjadi kesalahan saat menjalankan perintah.";
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMsg, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMsg, ephemeral: true });
      }
    }
  });
}
