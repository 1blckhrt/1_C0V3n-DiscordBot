import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
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
			const songs = await client.db.sotdQueue.findMany();
			if (!songs.length) {
				const embed = new EmbedBuilder()
					.setTitle("Song of the Day Queue")
					.setDescription("There are no songs in the queue.")
					.setColor(EmbedColor.red);

				await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
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
				.setColor(EmbedColor.green)
				.setFooter({
					text: "Requested by " + interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setThumbnail(`${client.user?.displayAvatarURL()}`);

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
