import type { CustomClient } from "../../constants.js";

export function deleteQuestion(client: CustomClient, question: string): void {
	client.db.prepare("DELETE FROM qotd_queue WHERE question = ?").run(question);
}
