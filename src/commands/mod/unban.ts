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
  .setName("unban")
  .setDescription("Cabut ban seorang user")
  .addStringOption((o) =>
    o.setName("userid").setDescription("ID Discord user yang akan di-unban").setRequired(true)
  )
  .addStringOption((o) =>
    o.setName("alasan").setDescription("Alasan unban").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

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

  const userId = interaction.options.getString("userid", true);
  const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";

  try {
    const banInfo = await interaction.guild.bans.fetch(userId);
    await interaction.guild.members.unban(userId, `${moderator.user.tag}: ${alasan}`);

    const embed = buildModEmbed({
      action: "UNBAN",
      target: `${banInfo.user.tag} (${userId})`,
      moderator: `${moderator.user.tag}`,
      reason: alasan,
      color: "#00CC44",
    });

    await sendLog(interaction.guild, embed);
    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({ content: "❌ User tidak ditemukan dalam daftar ban atau ID tidak valid.", ephemeral: true });
  }
}
