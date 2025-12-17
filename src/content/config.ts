import { defineCollection, z } from 'astro:content';

const categoriesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		words: z.array(z.string()),
	}),
});

export const collections = {
	categories: categoriesCollection,
};

