import type { CustomClient } from "../../constants.js";

export function deleteQuestion(client: CustomClient, question: string): void {
	void client.db.qotdQueue.deleteMany({
		where: {
			question,
		},
	});
}
