import type { TextChannel } from "discord.js";
import type { CustomClient } from "../../constants.js";
import { deleteQuestion } from "./deleteQuestion.js";
import { getRandomQuestion } from "./getRandom.js";

export async function sendAndDeleteQuestion(client: CustomClient): Promise<void> {
	try {
		const result = client.db.prepare("SELECT channel_id FROM qotd").get() as { channel_id: string } | undefined;
		if (!result?.channel_id) {
			console.error("No QOTD channel set.");
			return;
		}

		const qotdChannel = (await client.channels.fetch(result.channel_id)) as TextChannel | null;
		if (!qotdChannel) {
			console.error("QOTD channel not found.");
			return;
		}

		const question = getRandomQuestion(client);
		if (!question) {
			console.log("No questions available in the database.");
			return;
		}

		console.log(`Sending question: ${question}`);
		await qotdChannel.send(`Question of the Day: ${question}`);
		deleteQuestion(client, question);
		console.log("Question sent and deleted from the database.");
	} catch (error) {
		console.error("Error sending and deleting question:", error);
	}
}
