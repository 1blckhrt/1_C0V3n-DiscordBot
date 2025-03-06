import { MessageFlags } from "discord.js";
import { client } from "../util/constants.js";
import type { Component } from "../util/types/component.js";

export default {
	customId: "qotd_role",
	type: "Button",
	execute: async (interaction) => {
		const qotd = await client.db.qotd.findFirst({});

		if (!qotd) {
			await interaction.reply({
				content: "The qotd system is not set up!",
				ephemeral: true,
			});
			return;
		}

		const role = await interaction.guild?.roles.fetch(qotd.roleId);
		const member = await interaction.guild?.members.fetch(interaction.user.id);

		if (!role || !member) {
			await interaction.reply({
				content: "An error occurred while processing your request.",
				ephemeral: true,
			});
		}

		if (role && member?.roles.cache.has(role.id)) {
			await member.roles.remove(role);
			await interaction.reply({
				content: "You will no longer be pinged for QOTD messages.",
				flags: MessageFlags.Ephemeral,
			});
		} else if (role) {
			await member?.roles.add(role);
			await interaction.reply({
				content: "You will now be pinged for QOTD messages.",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
} as const satisfies Component<"Button">;
