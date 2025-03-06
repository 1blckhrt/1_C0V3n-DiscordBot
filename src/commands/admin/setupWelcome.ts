import { ApplicationCommandOptionType, EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "setup_welcome",
		description: "Sets up the welcome system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "channel",
				description: "The channel to send the welcome message in.",
				type: ApplicationCommandOptionType.Channel,
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
			const channel = interaction.options.getChannel("channel");
			const message = interaction.options.getString("message");

			const existing = await client.db.welcome.findFirst({
				where: {
					channelId: channel!.id,
				},
			});

			if (existing) {
				await interaction.reply({
					content: "The welcome system is already set up! Please remove it and try again!",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await client.db.welcome.create({
				data: {
					channelId: channel!.id,
					message: message!,
				},
			});

			const embed = new EmbedBuilder().setTitle("Welcome System Setup").setColor(EmbedColor.green);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "An error occurred while processing your request.",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
} as const satisfies Command;
