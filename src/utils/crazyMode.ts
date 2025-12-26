import type { CategoryData } from '../components/interfaces/CategoryData.interface';

export interface CrazyModeConfig {
	// Si está activo, no se puede elegir categoría
	disableCategorySelection: boolean;
	// La categoría Spicy no entra en este modo
	excludeSpicyCategory: boolean;
	// Pueden ser TODOS impostores
	allowAllImpostors: boolean;
	// Pueden ser TODOS diferentes palabras de diferentes categorías
	allowDifferentWordsFromDifferentCategories: boolean;
	// Pueden ser TODOS impostores y 1 solo jugador normal
	allowAllImpostorsOneNormal: boolean;
}

export const crazyModeConfig: CrazyModeConfig = {
	disableCategorySelection: true,
	excludeSpicyCategory: true,
	allowAllImpostors: true,
	allowDifferentWordsFromDifferentCategories: true,
	allowAllImpostorsOneNormal: true,
};

/**
 * Filtra las categorías disponibles excluyendo Spicy si está en modo Crazy
 */
export function getAvailableCategoriesForCrazyMode(
	categories: CategoryData[],
	gameMode: 'international' | 'national'
): CategoryData[] {
	return categories.filter(cat => cat.id !== 'spicy');
}

/**
 * Genera palabras para cada jugador en modo Crazy
 * Puede ser:
 * - Todos impostores
 * - Todos diferentes palabras de diferentes categorías
 * - Todos impostores y 1 solo jugador normal
 */
export function generateCrazyModeWords(
	players: string[],
	categories: CategoryData[],
	numberOfImpostors: number
): {
	words: string[];
	wordsEn: string[];
	hints: Record<string, string[]>;
	hintsEn: Record<string, string[]>;
	impostorIndices: number[];
} {
	const availableCategories = categories.filter(cat => cat.id !== 'spicy');
	
	if (availableCategories.length === 0) {
		throw new Error('No hay categorías disponibles para el modo Crazy');
	}

	// Decidir el tipo de configuración aleatoriamente
	const randomType = Math.random();
	
	let impostorIndices: number[] = [];
	let words: string[] = [];
	let wordsEn: string[] = [];
	const hints: Record<string, string[]> = {};
	const hintsEn: Record<string, string[]> = {};

	if (randomType < 0.33) {
		// Opción 1: TODOS impostores
		impostorIndices = players.map((_, index) => index);
		// Todos reciben palabras vacías (serán impostores)
		words = new Array(players.length).fill('');
		wordsEn = new Array(players.length).fill('');
	} else if (randomType < 0.66) {
		// Opción 2: TODOS diferentes palabras de diferentes categorías
		impostorIndices = [];
		
		for (let i = 0; i < players.length; i++) {
			// Seleccionar una categoría aleatoria
			// Si hay más jugadores que categorías, se pueden reutilizar categorías
			const categoryIndex = Math.floor(Math.random() * availableCategories.length);
			const category = availableCategories[categoryIndex];
			
			if (category.words && category.words.length > 0) {
				const wordIndex = Math.floor(Math.random() * category.words.length);
				words.push(category.words[wordIndex]);
				wordsEn.push(category.words_en[wordIndex]);
				
				// Guardar hints si existen
				const word = category.words[wordIndex];
				if (category.hints && category.hints[word]) {
					hints[word] = category.hints[word];
				}
				if (category.hints_en && category.hints_en[category.words_en[wordIndex]]) {
					hintsEn[category.words_en[wordIndex]] = category.hints_en[category.words_en[wordIndex]];
				}
			} else {
				words.push('');
				wordsEn.push('');
			}
		}
	} else {
		// Opción 3: TODOS impostores y 1 solo jugador normal
		impostorIndices = players.map((_, index) => index);
		const normalPlayerIndex = Math.floor(Math.random() * players.length);
		impostorIndices = impostorIndices.filter(index => index !== normalPlayerIndex);
		
		// Seleccionar una categoría y palabra para el jugador normal
		const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
		if (category.words && category.words.length > 0) {
			const wordIndex = Math.floor(Math.random() * category.words.length);
			const normalWord = category.words[wordIndex];
			const normalWordEn = category.words_en[wordIndex];
			
			// Inicializar arrays con palabras vacías
			words = new Array(players.length).fill('');
			wordsEn = new Array(players.length).fill('');
			
			// Asignar palabra al jugador normal
			words[normalPlayerIndex] = normalWord;
			wordsEn[normalPlayerIndex] = normalWordEn;
			
			// Guardar hints si existen
			if (category.hints && category.hints[normalWord]) {
				hints[normalWord] = category.hints[normalWord];
			}
			if (category.hints_en && category.hints_en[normalWordEn]) {
				hintsEn[normalWordEn] = category.hints_en[normalWordEn];
			}
		} else {
			words = new Array(players.length).fill('');
			wordsEn = new Array(players.length).fill('');
		}
	}

	return {
		words,
		wordsEn,
		hints,
		hintsEn,
		impostorIndices,
	};
}

