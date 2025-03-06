import { ApplicationCommandOptionType, EmbedBuilder, Events, MessageFlags } from "discord.js";
import { client, devEvents } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Command } from "../../util/types/command.js";

export default {
	data: {
		name: "emit",
		description: "Emit an event!",
		options: [
			{
				name: "event",
				description: "The event to emit.",
				type: ApplicationCommandOptionType.String,
				required: true,
				choices: Object.keys(devEvents).map((emit) => ({
					name: emit,
					value: emit,
				})),
			},
		],
	},
	devOnly: true,
	async execute({ interaction }) {
		try {
			const event = interaction.options.getString("event");

			if (event === Events.GuildMemberAdd) {
				const guild = interaction.guild;
				const member = guild?.members.cache.get(interaction.user.id);
				if (member) {
					client.emit(event, member);
				} else {
					throw new Error("GuildMember not found");
				}
			}

			if (event === Events.GuildMemberRemove) {
				const guild = interaction.guild;
				const member = guild?.members.cache.get(interaction.user.id);
				if (member) {
					client.emit(event, member);
				} else {
					throw new Error("GuildMember not found");
				}
			}

			const embed = new EmbedBuilder()
				.setTitle("✅ Success!")
				.setDescription(`The event \`${event}\` has been emitted!`)
				.setColor(EmbedColor.green);

			await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
