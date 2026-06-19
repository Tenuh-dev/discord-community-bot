import { Client, Events, Message } from "discord.js";
import { handleAutomod } from "../handlers/automod";

export function registerMessageCreateEvent(client: Client): void {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    await handleAutomod(message);
  });
}
