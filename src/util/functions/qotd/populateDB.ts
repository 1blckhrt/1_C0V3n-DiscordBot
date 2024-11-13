import type { CustomClient } from "../../constants.js";
import { questions } from "../../data/sotd/questions.js";

export function populateDB(client: CustomClient): void {
	const countStmt = client.db.prepare("SELECT COUNT(*) AS count FROM qotd_queue");
	const count = (countStmt.get() as { count: number }).count;

	if (count === 0) {
		const insertStmt = client.db.prepare("INSERT INTO qotd_queue (question) VALUES (?)");
		for (const question of questions) {
			insertStmt.run(question);
		}

		console.log("Database populated with initial questions.");
	} else {
		console.log("Database already has questions.");
	}
}
