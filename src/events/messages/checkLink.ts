import { Events } from "discord.js";
import { config } from "../../util/constants.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.MessageCreate,
	async execute(message) {
		try {
			const roles = config.linkBypass;
			const channels = config.channelsToCheck;

			if (
				channels.includes(message.channel.id) &&
				!roles.some((role) => message.member?.roles.cache.has(role)) &&
				config.linksToBlock.some((link) => message.content.includes(link))
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
