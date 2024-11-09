import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "add_sotd",
		description: "Adds songs to the song of the day queue.",
		dm_permission: false,
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
		options: [
			{
				name: "name",
				description: "The name of the song.",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: "artist",
				description: "The artist of the song.",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: "url",
				description: "The URL of the song.",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			const name = interaction.options.getString("name");
			const artist = interaction.options.getString("artist");
			const url = interaction.options.getString("url");

			client.db.prepare(`INSERT INTO sotd_queue (name, artist, url) VALUES (?, ?, ?)`).run(name, artist, url);

			console.log(`${name} ${artist} ${url}`);

			const embed = new EmbedBuilder()
				.setTitle("Song of the Day")
				.setDescription(`Song has been added to the queue.`)
				.setColor(EmbedColor.green)
				.setFooter({
					text: "Requested by " + interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setThumbnail(`${client.user?.displayAvatarURL()}`);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
