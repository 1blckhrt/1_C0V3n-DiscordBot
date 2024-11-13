import type { CustomClient } from "../../constants.js";

export function getRandomQuestion(client: CustomClient): string {
	const stmt = client.db.prepare("SELECT * FROM qotd ORDER BY RANDOM() LIMIT 1");
	const question = stmt.get() as string;

	if (question) {
		return question;
	} else {
		return "No questions in the database.";
	}
}
