import type { TextChannel } from "discord.js";
import { Events, EmbedBuilder } from "discord.js";
import { client } from "../../util/constants.js";
import EmbedColor from "../../util/enums/embedColor.js";
import type { Event } from "../../util/types/event.js";

export default {
	name: Events.GuildMemberRemove,
	async execute(member) {
		const result = await client.db.leave.findFirst({
			select: {
				channelId: true,
				message: true,
			},
		});
		if (!result) return;
		const channel = member.guild.channels.cache.get(result.channelId) as TextChannel;

		if (!channel) return;

		const embed = new EmbedBuilder()
			.setTitle("Goodbye!")
			.setDescription(`${result.message} ${member.user}`)
			.setColor(EmbedColor.red);

		await channel.send({ embeds: [embed] });
	},
} as const satisfies Event<Events.GuildMemberRemove>;
