import { questions } from "../../data/sotd/questions.js";

export function getRandomQuestion(): string {
	const randomIndex = Math.floor(Math.random() * questions.length);
	return questions[randomIndex];
}
