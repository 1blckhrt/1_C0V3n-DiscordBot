import type { CustomClient } from "../../constants.js";
import { questions } from "../../data/sotd/questions.js";

export async function populateDB(client: CustomClient) {
	const count = await client.db.qotdQueue.count();

	if (count === 0) {
		for (const question of questions) {
			await client.db.qotdQueue.create({
				data: { question },
			});
		}

		console.log("Database populated with initial questions.");
	} else {
		console.log("Database already has questions.");
	}
}
