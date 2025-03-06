import { ApplicationCommandOptionType, EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
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
			const name = interaction.options.getString("name")!;
			const artist = interaction.options.getString("artist")!;
			const url = interaction.options.getString("url")!;

			await client.db.sotdQueue.create({
				data: {
					name,
					artist,
					url,
				},
			});

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
