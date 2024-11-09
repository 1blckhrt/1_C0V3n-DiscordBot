import { Events } from "discord.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			switch (true) {
				case interaction.isChatInputCommand():
					console.log(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName}`);
					break;
				case interaction.isButton():
					console.log(`${interaction.user.tag} (${interaction.user.id}) > button: ${interaction.customId}`);
					break;
				case interaction.isStringSelectMenu():
					console.log(
						`${interaction.user.tag} (${interaction.user.id}) > selectMenu: ${interaction.customId}`,
					);
					break;
				case interaction.isModalSubmit():
					console.log(`${interaction.user.tag} (${interaction.user.id}) > modal: ${interaction.customId}`);
					break;
				default:
					console.log(`${interaction.user.tag} (${interaction.user.id}) > unknown interaction`);
					break;
			}
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Event<Events.InteractionCreate>;
