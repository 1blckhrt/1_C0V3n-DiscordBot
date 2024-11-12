import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import env from "../../env.json" assert { type: "json" };
import { client } from "../../util/constants.js";
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

			const feedbackDataList = client.db
				.prepare("SELECT message AS message_text, role_id FROM feedback")
				.all() as Feedback[];

			if (feedbackDataList.length === 0) {
				await interaction.reply({ content: "The feedback system has not been set up.", ephemeral: true });
				return;
			}

			const feedbackData = feedbackDataList[0];

			const errorEmbed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("You are not in the feedback channel!")
				.setColor(EmbedColor.red);

			if (interaction.channel && env.feedbackChannel.includes(interaction.channel.id)) {
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
			await interaction.reply({ content: "An error occurred while processing your request.", ephemeral: true });
		}
	},
} as const satisfies Command;
