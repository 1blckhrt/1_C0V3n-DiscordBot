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
			const statement = client.db.prepare("SELECT * FROM feedback").get() as {
				message_text: string;
				role_id: string;
			};

			const message = statement.message_text;
			const role = interaction.guild?.roles.cache.get(statement.role_id);

			const errorEmbed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("The feedback system has not been set up, or you are not in the correct channel.")
				.setColor(EmbedColor.red);

			console.log(interaction.channel?.id);

			if (interaction.channel && env.feedbackChannel.includes(interaction.channel.id)) {
				const embed = new EmbedBuilder()
					.setTitle("Feedback Request")
					.setDescription(`${message}`)
					.setColor(EmbedColor.green)
					.setFooter({
						text: "Requested by " + interaction.user.tag,
						iconURL: `${interaction.user.displayAvatarURL()}`,
					})
					.setTimestamp()
					.setThumbnail(`${client.user?.displayAvatarURL()}`);

				if (role) {
					await interaction.reply({ content: `<@&${role.id}>`, embeds: [embed] });
				} else {
					await interaction.reply({ content: "Role not found.", embeds: [embed] });
				}
			} else {
				await interaction.reply({ embeds: [errorEmbed] });
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "An error occurred while processing your request.", ephemeral: true });
		}
	},
} as const satisfies Command;
