import { PermissionFlagsBits } from "discord.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "ping",
		description: "Tests pings!",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			await interaction.reply("Pong!");
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
