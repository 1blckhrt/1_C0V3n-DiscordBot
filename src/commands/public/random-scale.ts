import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import { getRandomScale } from "../../util/functions/music/getRandom.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "generate-random-scale",
		description: "Generate a random scale.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const scale = getRandomScale();

			const embed = new EmbedBuilder()
				.setTitle("Random Scale Generated!")
				.addFields({
					name: "Scale",
					value: `${scale}`,
				})
				.setFooter({
					text: "Requested by " + interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setColor(EmbedColor.blue)
				.setThumbnail(`${client.user?.displayAvatarURL()}`);

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "An error occurred while processing your request.",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
} as const satisfies Command;
