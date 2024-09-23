import { EmbedBuilder } from 'discord.js';
import EmbedColor from '../enums/embedColor.js';

const embed = new EmbedBuilder()
	.setTitle('❌ Error')
	.setFields({
		name: 'Error',
		value: 'This command is only available to developers.',
	})
	.setColor(EmbedColor.red);

export default embed;
