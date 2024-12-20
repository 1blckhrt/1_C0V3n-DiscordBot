import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "setup_feedback",
		description: "Sets up the feedback system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "role",
				description: "The role to ping when messages looking for feedback are sent.",
				type: ApplicationCommandOptionType.Role,
				required: true,
			},
			{
				name: "message",
				description: "The message to send.",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const role = interaction.options.getRole("role");
			const message = interaction.options.getString("message");

			const existing = client.db.prepare("SELECT * FROM feedback WHERE role_id = ?").get(role?.id);

			if (existing) {
				await interaction.reply({
					content: "The feedback system is already set up! Please remove it and try again!",
					ephemeral: true,
				});
				return;
			}

			client.db.prepare("INSERT INTO feedback (role_id, message) VALUES (?, ?)").run(role?.id, message);

			const embed = new EmbedBuilder()
				.setTitle("Feedback System Setup")
				.setDescription(
					`The role <@&${role?.id}> will be pinged when feedback is requested. The message is: ${message}`,
				)
				.setColor(EmbedColor.green);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "An error occurred while processing your request.",
				ephemeral: true,
			});
		}
	},
} as const satisfies Command;
