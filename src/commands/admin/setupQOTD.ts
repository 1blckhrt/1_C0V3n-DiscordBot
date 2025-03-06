import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
	PermissionFlagsBits,
	TextChannel,
} from "discord.js";
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
			{
				name: "channel-button",
				description: "The channel to send the button in.",
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},
		],
	},
	async execute({ interaction }) {
		try {
			const channel = interaction.options.getChannel("channel");
			const role = interaction.options.getRole("role");

			const existing = await client.db.qotd.findFirst({
				where: {
					channelId: channel?.id ?? "",
					roleId: role?.id ?? "",
				},
			});

			if (existing) {
				await interaction.reply({
					content: "The question of the day system is already set up! Please remove it and try again!",
					flags: MessageFlags.Ephemeral,
				});
			}

			await client.db.qotd.create({
				data: {
					channelId: channel!.id,
					roleId: role!.id,
				},
			});

			await client.db.qotd.create({
				data: {
					channelId: channel!.id,
					roleId: role!.id,
				},
			});

			const button = new ButtonBuilder()
				.setCustomId("qotd_role")
				.setLabel("QOTD Role")
				.setStyle(ButtonStyle.Primary);

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

			if (!channel) {
				await interaction.reply({
					content: "The specified channel was not found.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			if (channel instanceof TextChannel) {
				await channel.send({
					components: [row],
				});
			} else {
				await interaction.reply({
					content: "The specified channel is not a text channel.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle("Question of the Day")
				.setDescription(`Question of the day has been set up in <#${channel?.id}>.`)
				.setColor(EmbedColor.green);

			await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "An error occurred while processing your request.",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
} as const satisfies Command;
