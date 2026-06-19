import { GuildMember, PermissionFlagsBits } from "discord.js";
import { config } from "../config";

export function isOwner(member: GuildMember): boolean {
  return (
    member.id === member.guild.ownerId ||
    member.id === config.ownerId
  );
}

export function isModerator(member: GuildMember): boolean {
  return (
    member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
    member.roles.cache.some((r) => r.name === config.modsRoleName)
  );
}

export function isProtected(member: GuildMember): boolean {
  if (isOwner(member)) return true;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  return false;
}

export function canModerate(moderator: GuildMember, target: GuildMember): boolean {
  if (isProtected(target)) return false;
  if (!isModerator(moderator)) return false;
  if (moderator.roles.highest.position <= target.roles.highest.position) return false;
  return true;
}
