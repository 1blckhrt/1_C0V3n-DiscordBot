import type { Command } from '../../util/types/command.js';

export default {
	data: {
		name: 'ping',
		description: 'Tests pings!',
	},
	devOnly: false,
	async execute({ interaction }) {
		try {
			await interaction.reply('Pong!');
		} catch (error) {
			console.error(error);
		}
	},
} as const satisfies Command;
