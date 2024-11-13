import { Events } from "discord.js";
import cron from "node-cron";
import type { CustomClient } from "../../util/constants.js";
import UserStatus from "../../util/enums/status.js";
import { sendAndDeleteQuestion } from "../../util/functions/qotd/sendAndDelete.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.clear();
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setStatus(UserStatus.Dnd);

		cron.schedule("* * * * *", async () => {
			// replace with every day at 12:00 PM
			return sendAndDeleteQuestion(client as CustomClient);
		});
	},
} as const satisfies Event<Events.ClientReady>;
