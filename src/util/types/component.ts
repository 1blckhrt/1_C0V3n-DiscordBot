import type { ButtonInteraction, AnySelectMenuInteraction, ModalSubmitInteraction } from 'discord.js';
import { z } from 'zod';

export type Component<Type extends 'Button' | 'Modal' | 'SelectMenu'> = {
	customId: string;
	execute(
		interaction: Type extends 'Button'
			? ButtonInteraction
			: Type extends 'Modal'
				? ModalSubmitInteraction
				: Type extends 'SelectMenu'
					? AnySelectMenuInteraction
					: never,
	): Promise<void> | void;

	type: string;
};
export const componentSchema = z.object({
	customId: z.string(),
	execute: z.function(),
});

export function isComponent<Type extends 'Button' | 'Modal' | 'SelectMenu'>(
	structure: unknown,
): structure is Component<Type> {
	return componentSchema.safeParse(structure).success;
}
