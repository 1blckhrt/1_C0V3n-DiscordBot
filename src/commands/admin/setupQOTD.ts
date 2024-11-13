import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "setup_qotd",
		description: "Sets up the question of the day system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "channel",
				description: "The channel to send the questions of the day in.",
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},
			{
				name: "role",
				description: "The role to ping when the question of the day is sent.",
				type: ApplicationCommandOptionType.Role,
				required: true,
			},
		],
	},
	async execute({ interaction }) {
		try {
			const channel = interaction.options.getChannel("channel");
			const role = interaction.options.getRole("role");

			client.db.prepare("INSERT INTO qotd (channel_id, role_id) VALUES (?, ?)").run(channel?.id, role?.id);

			const embed = new EmbedBuilder()
				.setTitle("Question of the Day")
				.setDescription(`Question of the day has been set up in <#${channel?.id}>.`)
				.setColor(EmbedColor.green);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "An error occurred while processing your request.", ephemeral: true });
		}
	},
} as const satisfies Command;
