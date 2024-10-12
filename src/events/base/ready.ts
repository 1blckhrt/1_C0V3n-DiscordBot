import { Events } from "discord.js";
import UserStatus from "../../util/enums/status.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.clear();
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setStatus(UserStatus.Dnd);
	},
} as const satisfies Event<Events.ClientReady>;
