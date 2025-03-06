import { EmbedBuilder, type TextChannel } from "discord.js";
import type { CustomClient } from "../../constants.js";
import EmbedColor from "../../enums/embedColor.js";
import { deleteQuestion } from "./deleteQuestion.js";
import { getRandomQuestion } from "./getRandomQuestion.js";

export async function sendAndDeleteQuestion(client: CustomClient): Promise<void> {
	try {
		const result = await client.db.qotd.findFirst({
			select: { channelId: true },
		});
		if (!result?.channelId) {
			console.error("No QOTD channel set.");
			return;
		}

		const qotdChannel = (await client.channels.fetch(result.channelId)) as TextChannel | null;
		if (!qotdChannel) {
			console.error("QOTD channel not found.");
			return;
		}

		const question = await getRandomQuestion(client);
		if (!question) {
			console.log("No questions available in the database.");
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("Question of the Day")
			.setDescription(question)
			.setColor(EmbedColor.yellow)
			.setTimestamp()
			.setThumbnail(`${client.user?.displayAvatarURL()}`)
			.setColor(EmbedColor.blue);
		await qotdChannel.send({ embeds: [embed] });

		console.log(`Sending question: ${question}`);
		await qotdChannel.send(`Question of the Day: ${question}`);
		deleteQuestion(client, question);
		console.log("Question sent and deleted from the database.");
	} catch (error) {
		console.error("Error sending and deleting question:", error);
	}
}
