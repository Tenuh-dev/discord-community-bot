import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  GuildMember,
  TextChannel,
} from "discord.js";
import { isModerator } from "../../utils/permissions";
import { buildModEmbed } from "../../utils/embed";
import { sendLog } from "../../handlers/logs";

export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Hapus sejumlah pesan di channel")
  .addIntegerOption((o) =>
    o
      .setName("jumlah")
      .setDescription("Jumlah pesan yang akan dihapus (1-100)")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .addUserOption((o) =>
    o.setName("target").setDescription("Hapus pesan dari user tertentu saja").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

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

  const jumlah = interaction.options.getInteger("jumlah", true);
  const targetUser = interaction.options.getUser("target");
  const channel = interaction.channel as TextChannel;

  await interaction.deferReply({ ephemeral: true });

  try {
    const messages = await channel.messages.fetch({ limit: jumlah });

    const toDelete = targetUser
      ? messages.filter((m) => m.author.id === targetUser.id)
      : messages;

    const deleted = await channel.bulkDelete(toDelete, true);

    const embed = buildModEmbed({
      action: "CLEAR CHAT",
      target: targetUser ? `${targetUser.tag} (${targetUser.id})` : "Semua user",
      moderator: `${moderator.user.tag}`,
      reason: `Menghapus ${deleted.size} pesan di ${channel.name}`,
      color: "#0099FF",
    });

    await sendLog(interaction.guild, embed);
    await interaction.editReply({
      content: `✅ Berhasil menghapus **${deleted.size}** pesan${targetUser ? ` dari ${targetUser.tag}` : ""}.`,
    });
  } catch (err) {
    await interaction.editReply({
      content: "❌ Gagal hapus pesan. Pesan mungkin sudah lebih dari 14 hari.",
    });
  }
}
