import type { CustomClient } from "../../constants.js";

export function deleteQuestion(client: CustomClient, question: string): void {
	client.db.prepare("DELETE FROM questions WHERE question = ?").run(question);
}
