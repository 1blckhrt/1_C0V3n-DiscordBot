import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { client, config } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "request_feedback",
		description: "Request feedback from fellow members.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			type Feedback = {
				message_text: string;
				role_id: string;
			};

			const feedbackDataList = (await client.db.feedback.findMany({
				select: {
					message: true,
					roleId: true,
				},
			})) as unknown as Feedback[];

			if (feedbackDataList.length === 0) {
				await interaction.reply({
					content: "The feedback system has not been set up.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const feedbackData = feedbackDataList[0];

			const errorEmbed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("You are not in the feedback channel!")
				.setColor(EmbedColor.red);

			if (!config.feedbackChannel) {
				await interaction.reply({
					content: "The feedback channel has not been set up.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			if (interaction.channel && config.feedbackChannel.includes(interaction.channel.id)) {
				const embed = new EmbedBuilder()
					.setTitle("Feedback Request")
					.setDescription(`${feedbackData.message_text}`)
					.setColor(EmbedColor.green)
					.setFooter({
						text: "Requested by " + interaction.user.tag,
						iconURL: `${interaction.user.displayAvatarURL()}`,
					})
					.setTimestamp()
					.setThumbnail(`${client.user?.displayAvatarURL()}`);

				await interaction.reply({ content: `<@&${feedbackData.role_id}>`, embeds: [embed] });
			} else {
				await interaction.reply({ embeds: [errorEmbed] });
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "An error occurred while processing your request.",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
} as const satisfies Command;
