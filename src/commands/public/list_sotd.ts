import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "list_sotd",
		description: "Lists songs in the song of the day queue.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
	},
	async execute({ interaction }) {
		try {
			const songs = client.db.prepare("SELECT * FROM sotd_queue").all();
			if (!songs.length) {
				const embed = new EmbedBuilder()
					.setTitle("Song of the Day Queue")
					.setDescription("There are no songs in the queue.")
					.setColor(EmbedColor.red);

				await interaction.reply({ embeds: [embed], ephemeral: true });
				return;
			}

			const array: string[] = [];
			for (const song of songs) {
				console.log(song);
				type Song = { artist: string; name: string; url: string };

				const { artist, name, url } = song as Song;

				array.push(`**${name}** by **${artist}** - [Link](${url})`);
			}

			const embed = new EmbedBuilder()
				.setTitle("Song of the Day Queue")
				.setDescription(array.join("\n"))
				.setColor(EmbedColor.green);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
