import { defineCollection, z } from 'astro:content';

const categoriesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		words: z.array(z.string()),
		words_en: z.array(z.string()),
		hints: z.record(z.string(), z.array(z.string())),
		hints_en: z.record(z.string(), z.array(z.string())),
	}),
});

export const collections = {
	categories: categoriesCollection,
};

