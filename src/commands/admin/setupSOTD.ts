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
		name: "setup_sotd",
		description: "Sets up the song of the day system.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
		options: [
			{
				name: "channel",
				description: "The channel to send the song of the day in.",
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},
			{
				name: "message",
				description: "The message to send.",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: "role",
				description: "The role to ping when the song of the day is sent.",
				type: ApplicationCommandOptionType.Role,
				required: true,
			},
		],
	},
	async execute({ interaction }) {
		try {
			const channel = interaction.options.getChannel("channel");
			const message = interaction.options.getString("message");
			const role = interaction.options.getRole("role");

			const existing = await client.db.sotd.findFirst({
				where: {
					channelId: channel?.id ?? "",
					roleId: role?.id ?? "",
				},
			});

			if (existing) {
				await interaction.reply({
					content: "The song of the day system is already set up! Please remove it and try again!",
					ephemeral: true,
				});
				return;
			}

			await client.db.sotd.create({
				data: {
					channelId: channel!.id,
					message: message!,
					roleId: role!.id,
				},
			});
			const embed = new EmbedBuilder()
				.setTitle("Song of the Day")
				.setDescription(`Song of the day has been set up in <#${channel?.id}>.`)
				.setColor(EmbedColor.green);

			const button = new ButtonBuilder()
				.setCustomId("sotd_role")
				.setLabel("Song of the Day Role")
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
					content: message!,
					components: [row],
				});
			} else {
				await interaction.reply({
					content: "The specified channel is not a text channel.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

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
