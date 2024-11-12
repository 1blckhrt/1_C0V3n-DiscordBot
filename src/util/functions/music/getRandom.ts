import { progressions } from "../../data/music/progressions.js";
import { scales } from "../../data/music/scales.js";

export function getRandomProgression(): string {
	const randomIndex = Math.floor(Math.random() * progressions.length);
	return progressions[randomIndex];
}

export function getRandomScale(): string {
	const randomIndex = Math.floor(Math.random() * scales.length);
	const scale = scales[randomIndex];
	return `${scale.rootNote} ${scale.mode.charAt(0).toUpperCase() + scale.mode.slice(1)}`;
}
