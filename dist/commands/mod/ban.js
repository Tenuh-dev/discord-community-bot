"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../utils/permissions");
const embed_1 = require("../../utils/embed");
const logs_1 = require("../../handlers/logs");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban seorang member dari server")
    .addUserOption((o) => o.setName("target").setDescription("User yang akan di-ban").setRequired(true))
    .addStringOption((o) => o.setName("alasan").setDescription("Alasan ban").setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers);
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
    const target = interaction.options.getMember("target");
    if (!target) {
        await interaction.reply({ content: "❌ User tidak ditemukan di server.", ephemeral: true });
        return;
    }
    if ((0, permissions_1.isProtected)(target)) {
        await interaction.reply({ content: "❌ User ini tidak bisa di-ban (owner/admin dilindungi).", ephemeral: true });
        return;
    }
    if (!target.bannable) {
        await interaction.reply({ content: "❌ Bot tidak punya izin untuk ban user ini.", ephemeral: true });
        return;
    }
    if (moderator.roles.highest.position <= target.roles.highest.position) {
        await interaction.reply({ content: "❌ Kamu tidak bisa ban user dengan role lebih tinggi atau setara.", ephemeral: true });
        return;
    }
    const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";
    await target.ban({ reason: `${moderator.user.tag}: ${alasan}`, deleteMessageSeconds: 86400 });
    const embed = (0, embed_1.buildModEmbed)({
        action: "BAN",
        target: `${target.user.tag} (${target.id})`,
        moderator: `${moderator.user.tag}`,
        reason: alasan,
        color: "#CC0000",
    });
    await (0, logs_1.sendLog)(interaction.guild, embed);
    await interaction.reply({ embeds: [embed] });
}
