import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "setup_greeting",
		description: "Sets up or removes the welcome/leave system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "welcome",
				description: "Sets up the welcome message.",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "channel",
						description: "The channel to send the welcome message in.",
						type: ApplicationCommandOptionType.Channel,
						required: true,
					},
				],
			},
			{
				name: "leave",
				description: "Sets up the leave message.",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "channel",
						description: "The channel to send the leave message in.",
						type: ApplicationCommandOptionType.Channel,
						required: true,
					},
				],
			},
		],
	},

	devOnly: false,
	async execute({ interaction }) {
		try {
			const subCommand = interaction.options.getSubcommand();
			const channel = interaction.options.getChannel("channel", true);

			switch (subCommand) {
				case "welcome":
					client.db.prepare(`INSERT INTO welcome (channel_id) VALUES (?)`).run(channel.id);
					await interaction.reply({
						content: "Successfully set up the welcome message.",
						ephemeral: true,
					});

					break;

				case "leave":
					client.db.prepare("INSERT INTO leave (channel_id) VALUES (?)").run(channel.id);
					await interaction.reply({
						content: "Successfully set up the leave message.",
						ephemeral: true,
					});

					break;

				case null:
					await interaction.reply({
						content: "Please specify a subcommand.",
						ephemeral: true,
					});
			}
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
