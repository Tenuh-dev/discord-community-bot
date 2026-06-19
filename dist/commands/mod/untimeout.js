"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../utils/permissions");
const embed_1 = require("../../utils/embed");
const logs_1 = require("../../handlers/logs");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Cabut timeout dari seorang member")
    .addUserOption((o) => o.setName("target").setDescription("User yang timeoutnya akan dicabut").setRequired(true))
    .addStringOption((o) => o.setName("alasan").setDescription("Alasan pencabutan timeout").setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers);
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
    if (!target.communicationDisabledUntil) {
        await interaction.reply({ content: "❌ User ini tidak sedang dalam timeout.", ephemeral: true });
        return;
    }
    const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";
    await target.timeout(null, `${moderator.user.tag}: ${alasan}`);
    const embed = (0, embed_1.buildModEmbed)({
        action: "CABUT TIMEOUT",
        target: `${target.user.tag} (${target.id})`,
        moderator: `${moderator.user.tag}`,
        reason: alasan,
        color: "#00CC44",
    });
    await (0, logs_1.sendLog)(interaction.guild, embed);
    await interaction.reply({ embeds: [embed] });
}
