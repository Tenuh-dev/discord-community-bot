import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  GuildMember,
} from "discord.js";
import { isModerator } from "../../utils/permissions";
import { buildModEmbed } from "../../utils/embed";
import { sendLog } from "../../handlers/logs";

export const data = new SlashCommandBuilder()
  .setName("untimeout")
  .setDescription("Cabut timeout dari seorang member")
  .addUserOption((o) =>
    o.setName("target").setDescription("User yang timeoutnya akan dicabut").setRequired(true)
  )
  .addStringOption((o) =>
    o.setName("alasan").setDescription("Alasan pencabutan timeout").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guild || !interaction.member) {
    await interaction.reply({ content: "Perintah ini hanya bisa digunakan di server.", ephemeral: true });
    return;
  }

  const moderator = interaction.member as GuildMember;
  if (!isModerator(moderator)) {
    await interaction.reply({ content: "❌ Kamu tidak punya izin untuk melakukan ini.", ephemeral: true });
    return;
  }

  const target = interaction.options.getMember("target") as GuildMember | null;
  if (!target) {
    await interaction.reply({ content: "❌ User tidak ditemukan di server.", ephemeral: true });
    return;
  }

  if (!target.communicationDisabledUntil) {
    await interaction.reply({ content: "❌ User ini tidak sedang dalam timeout.", ephemeral: true });
    return;
  }

  const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";

  await target.timeout(null, `${moderator.user.tag}: ${alasan}`);

  const embed = buildModEmbed({
    action: "CABUT TIMEOUT",
    target: `${target.user.tag} (${target.id})`,
    moderator: `${moderator.user.tag}`,
    reason: alasan,
    color: "#00CC44",
  });

  await sendLog(interaction.guild, embed);
  await interaction.reply({ embeds: [embed] });
}
