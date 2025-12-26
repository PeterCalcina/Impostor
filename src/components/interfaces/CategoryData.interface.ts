export interface CategoryData {
	id: string;
	words: string[];
	words_en: string[];
	hints: Record<string, string[]>;
	hints_en: Record<string, string[]>;
}