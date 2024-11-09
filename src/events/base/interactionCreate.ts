import { Events } from "discord.js";
import env from "../../env.json" assert { type: "json" };
import { client } from "../../util/constants.js";
import notDev from "../../util/embeds/notDev.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			if (interaction.isChatInputCommand()) {
				const command = client.commands.get(interaction.commandName);

				const isDeveloper = env.devIDs.includes(interaction.user.id);

				if (command?.devOnly && !isDeveloper) {
					await interaction.reply({ embeds: [notDev], ephemeral: true });
					return;
				}

				await command?.execute({ interaction });
			} else if (interaction.isButton()) {
				const button = client.buttons.get(interaction.customId);
				await button?.execute(interaction);
			} else if (interaction.isStringSelectMenu()) {
				const selectMenu = client.selectMenus.get(interaction.customId);
				await selectMenu?.execute(interaction);
			} else if (interaction.isModalSubmit()) {
				const modal = client.modals.get(interaction.customId);
				await modal?.execute(interaction);
			}
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Event<Events.InteractionCreate>;
