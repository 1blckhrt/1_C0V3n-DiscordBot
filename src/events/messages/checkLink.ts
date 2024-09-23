import { Events } from "discord.js";
import env from "../../env.json" assert { type: "json" };
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.MessageCreate,
	async execute(message) {
		try {
			const roles = env.linkBypass;
			const channels = env.channelsToCheck;

			if (
				channels.includes(message.channel.id) &&
				!roles.some((role) => message.member?.roles.cache.has(role)) &&
				env.linksToBlock.some((link) => message.content.includes(link))
			) {
				await message.channel.send({
					content: `${message.author}, you can't send music links or server invites here! Please wait one week since joining the server to be able to post links in the promo channel!`,
				});

				await message.delete();
			}
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Event<Events.MessageCreate>;
