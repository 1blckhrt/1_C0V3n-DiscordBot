import type { CustomClient } from "../../constants.js";

export async function getRandomQuestion(client: CustomClient): Promise<string | null> {
	const questions = await client.db.qotdQueue.findMany({
		select: {
			question: true,
		},
	});

	if (!questions.length) return null;

	const randomIndex = Math.floor(Math.random() * questions.length);

	return questions[randomIndex].question;
}
