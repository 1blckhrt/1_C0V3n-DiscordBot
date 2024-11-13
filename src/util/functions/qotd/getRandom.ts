import type { CustomClient } from "../../constants.js";

export function getRandomQuestion(client: CustomClient): string | null {
	const stmt = client.db.prepare("SELECT question FROM qotd_queue ORDER BY RANDOM() LIMIT 1");
	const result = stmt.get() as { question: string } | undefined;

	return result?.question ?? null;
}
