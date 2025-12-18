import { defineCollection, z } from 'astro:content';

const categoriesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		words: z.array(z.string()),
		words_en: z.array(z.string()).optional(),
	}),
});

export const collections = {
	categories: categoriesCollection,
};

