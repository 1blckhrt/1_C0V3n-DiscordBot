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
			{
				name: "channel-button",
				description: "The channel to send the button in.",
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},
		],
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const role = interaction.options.getRole("role");
			const message = interaction.options.getString("message");

			const existing = await client.db.feedback.findFirst({
				where: {
					roleId: role!.id,
				},
			});

			if (existing) {
				await interaction.reply({
					content: "The feedback system is already set up! Please remove it and try again!",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			await client.db.feedback.create({
				data: {
					roleId: role!.id,
					message: message!,
				},
			});

			const button = new ButtonBuilder()
				.setCustomId("feedback_role")
				.setLabel("Feedback Role")
				.setStyle(ButtonStyle.Primary);

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

			const channel = interaction.options.getChannel("channel-button");

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

			const embed = new EmbedBuilder().setTitle("Feedback System Setup").setColor(EmbedColor.green);

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
