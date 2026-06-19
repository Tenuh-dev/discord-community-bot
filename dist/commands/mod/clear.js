"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../utils/permissions");
const embed_1 = require("../../utils/embed");
const logs_1 = require("../../handlers/logs");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("clear")
    .setDescription("Hapus sejumlah pesan di channel")
    .addIntegerOption((o) => o
    .setName("jumlah")
    .setDescription("Jumlah pesan yang akan dihapus (1-100)")
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(100))
    .addUserOption((o) => o.setName("target").setDescription("Hapus pesan dari user tertentu saja").setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages);
async function execute(interaction) {
    if (!interaction.guild || !interaction.member) {
        await interaction.reply({ content: "Perintah ini hanya bisa digunakan di server.", ephemeral: true });
        return;
    }
    const moderator = interaction.member;
    if (!(0, permissions_1.isModerator)(moderator)) {
        await interaction.reply({ content: "❌ Kamu tidak punya izin untuk melakukan ini.", ephemeral: true });
        return;
    }
    const jumlah = interaction.options.getInteger("jumlah", true);
    const targetUser = interaction.options.getUser("target");
    const channel = interaction.channel;
    await interaction.deferReply({ ephemeral: true });
    try {
        const messages = await channel.messages.fetch({ limit: jumlah });
        const toDelete = targetUser
            ? messages.filter((m) => m.author.id === targetUser.id)
            : messages;
        const deleted = await channel.bulkDelete(toDelete, true);
        const embed = (0, embed_1.buildModEmbed)({
            action: "CLEAR CHAT",
            target: targetUser ? `${targetUser.tag} (${targetUser.id})` : "Semua user",
            moderator: `${moderator.user.tag}`,
            reason: `Menghapus ${deleted.size} pesan di ${channel.name}`,
            color: "#0099FF",
        });
        await (0, logs_1.sendLog)(interaction.guild, embed);
        await interaction.editReply({
            content: `✅ Berhasil menghapus **${deleted.size}** pesan${targetUser ? ` dari ${targetUser.tag}` : ""}.`,
        });
    }
    catch (err) {
        await interaction.editReply({
            content: "❌ Gagal hapus pesan. Pesan mungkin sudah lebih dari 14 hari.",
        });
    }
}
