import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import { config } from "../config";

export async function sendLog(guild: Guild, embed: EmbedBuilder): Promise<void> {
  try {
    const logChannel = guild.channels.cache.find(
      (c) => c.name === config.logChannelName && c.isTextBased()
    ) as TextChannel | undefined;

    if (!logChannel) {
      console.warn(`[Logs] Channel "${config.logChannelName}" tidak ditemukan di ${guild.name}`);
      return;
    }

    await logChannel.send({ embeds: [embed] });
  } catch (err) {
    console.error("[Logs] Gagal kirim log:", err);
  }
}

export async function ensureLogChannel(guild: Guild): Promise<TextChannel | null> {
  try {
    const existing = guild.channels.cache.find(
      (c) => c.name === config.logChannelName && c.isTextBased()
    ) as TextChannel | undefined;

    if (existing) return existing;

    const created = await guild.channels.create({
      name: config.logChannelName,
      reason: "AutoMod log channel dibuat otomatis oleh bot",
    });

    console.log(`[Logs] Channel "${config.logChannelName}" dibuat di ${guild.name}`);
    return created as TextChannel;
  } catch (err) {
    console.error("[Logs] Gagal buat log channel:", err);
    return null;
  }
}
