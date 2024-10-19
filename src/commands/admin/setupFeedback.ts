import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "setup_feedback",
		description: "Sets up the feedback system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "channel",
				description: "The channel to send the feedback messages in.",
				type: ApplicationCommandOptionType.Channel,
			},
			{
				name: "role",
				description: "The role to ping when messages looking for feedback are sent.",
				type: ApplicationCommandOptionType.Role,
			},
			{
				name: "message",
				description: "The message to send.",
				type: ApplicationCommandOptionType.String,
			},
		],
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const channel = interaction.options.getChannel("channel");
			const role = interaction.options.getRole("role");
			const message = interaction.options.getString("message");

			const feedback = client.db.prepare("SELECT * FROM feedback WHERE channel_id = ?").get(channel?.id);

			if (feedback) {
				client.db.prepare("DELETE FROM feedback WHERE channel_id = ?").run(channel?.id);
			}

			client.db
				.prepare("INSERT INTO feedback (channel_id, role_id, message) VALUES (?, ?, ?)")
				.run(channel?.id, role?.id, message);

			await interaction.reply(`Feedback has been set up in ${channel}.`);
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
