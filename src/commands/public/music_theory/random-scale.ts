import { EmbedBuilder } from "discord.js";
import { getRandomScale } from "../../../util/functions/music/getRandom.js";
import type { Command } from "../../../util/types/command.js";

export default {
	data: {
		name: "generate-random-scale",
		description: "Generate a random scale,",
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const scale = getRandomScale();

			const embed = new EmbedBuilder().setTitle("Random Scale Generated!").addFields({
				name: "Scale",
				value: `${scale}`,
			});

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
