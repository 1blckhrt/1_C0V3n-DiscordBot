import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import { getRandomProgression } from "../../util/functions/music/getRandom.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "generate-random-progression",
		description: "Generate a random progression.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const progression = getRandomProgression();

			const embed = new EmbedBuilder()
				.setTitle("Random Progression Generated!")
				.setDescription("Here is a random progression for you to use in your music!")
				.addFields({
					name: "Progression",
					value: `${progression}`,
				})
				.setFooter({
					text: "Requested by " + interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setThumbnail(`${client.user?.displayAvatarURL()}`)
				.setColor(EmbedColor.blue);
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
