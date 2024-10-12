import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "join_leave",
		description: "Sets up or removes the welcome/leave system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "welcome",
				description: "Sets up the welcome message.",
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: "setup",
						description: "Sets up the welcome message.",
						type: ApplicationCommandOptionType.Subcommand,
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
					{
						name: "remove",
						description: "Removes the welcome message.",
						type: ApplicationCommandOptionType.Subcommand,
					},
				],
			},
			{
				name: "leave",
				description: "Sets up the leave message.",
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: "setup",
						description: "Sets up the leave message.",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: "channel",
								description: "The channel to send the leave message in.",
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
					{
						name: "remove",
						description: "Removes the leave message.",
						type: ApplicationCommandOptionType.Subcommand,
					},
				],
			},
		],
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const subCommand = interaction.options.getSubcommandGroup(false);
			const subSubCommand = interaction.options.getSubcommand();
			const channel = interaction.options.getChannel("channel", true);
			const message = interaction.options.getString("message", true);

			switch (subCommand) {
				case "welcome":
					if (subSubCommand === "setup") {
						client.db
							.prepare("INSERT INTO welcome (channel_id, message) VALUES (?, ?)")
							.run(channel.id, message);
						await interaction.reply({
							content: "Successfully set up the welcome message.",
							ephemeral: true,
						});
					}

					if (subSubCommand === "remove") {
						client.db.prepare("DELETE FROM welcome WHERE channel_id = ?").run(channel.id);
						await interaction.reply({
							content: "Successfully removed the welcome message.",
							ephemeral: true,
						});
					}

					break;

				case "leave":
					if (subSubCommand === "setup") {
						client.db
							.prepare("INSERT INTO leave (channel_id, message) VALUES (?, ?)")
							.run(channel.id, message);
						await interaction.reply({
							content: "Successfully set up the leave message.",
							ephemeral: true,
						});
					}

					if (subSubCommand === "remove") {
						const statement = client.db.prepare("DELETE FROM leave WHERE channel_id = ?");
						statement.run(channel.id);
						await interaction.reply({
							content: "Successfully removed the leave message.",
							ephemeral: true,
						});
					}

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
