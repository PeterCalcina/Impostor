import { atom } from 'nanostores';

export interface GameState {
	players: string[];
	selectedCategory: string | null;
	randomCategory: boolean;
	impostorHintsEnabled: boolean;
	crazyMode: boolean;
	numberOfImpostors: number;
	secretWord: string;
	secretWordEn: string;
	// For crazy mode: words per player
	secretWords: string[];
	secretWordsEn: string[];
	secretWordHints: Record<string, string[]>;
	secretWordHintsEn: Record<string, string[]>;
	impostorIndices: number[];
	currentPlayerIndex: number;
	startingPlayerIndex: number;
	gameDirection: 'left' | 'right';
	gameStarted: boolean;
	gameFinished: boolean;
	gameMode: 'international' | 'national';
}

export const gameStore = atom<GameState>({
	players: [],
	selectedCategory: null,
	randomCategory: false,
	impostorHintsEnabled: false,
	crazyMode: false,
	numberOfImpostors: 1,
	secretWord: '',
	secretWordEn: '',
	secretWords: [],
	secretWordsEn: [],
	secretWordHints: {},
	secretWordHintsEn: {},
	impostorIndices: [],
	currentPlayerIndex: 0,
	startingPlayerIndex: 0,
	gameDirection: 'right',
	gameStarted: false,
	gameFinished: false,
	gameMode: 'international',
});

export function addPlayer(name: string) {
	const state = gameStore.get();
	if (name.trim() && !state.players.includes(name.trim())) {
		gameStore.set({
			...state,
			players: [...state.players, name.trim()],
		});
	}
}

export function removePlayer(name: string) {
	const state = gameStore.get();
	gameStore.set({
		...state,
		players: state.players.filter((p) => p !== name),
	});
}

export function setCategory(category: string) {
	const state = gameStore.get();
	if (state.crazyMode) {
		return; // Cannot select category in crazy mode
	}
	gameStore.set({
		...state,
		selectedCategory: category,
		randomCategory: false, // Disable random when manually selecting a category
	});
}

export function setRandomCategory(enabled: boolean) {
	const state = gameStore.get();
	if (state.crazyMode) {
		return; // Cannot use random category in crazy mode
	}
	gameStore.set({
		...state,
		randomCategory: enabled,
		selectedCategory: enabled ? null : state.selectedCategory, // Clear selection when enabling random
	});
}

export function setImpostorHintsEnabled(enabled: boolean) {
	const state = gameStore.get();
	gameStore.set({
		...state,
		impostorHintsEnabled: enabled,
	});
}

export function setCrazyMode(enabled: boolean) {
	const state = gameStore.get();
	gameStore.set({
		...state,
		crazyMode: enabled,
		selectedCategory: enabled ? null : state.selectedCategory, // Clear selection when enabling crazy mode
		randomCategory: enabled ? false : state.randomCategory, // Disable random when enabling crazy mode
	});
}

export function setNumberOfImpostors(count: number) {
	const state = gameStore.get();
	gameStore.set({
		...state,
		numberOfImpostors: count,
	});
}

export function setGameMode(mode: 'international' | 'national') {
	const state = gameStore.get();
	gameStore.set({
		...state,
		gameMode: mode,
		selectedCategory: null, // Reset category when changing mode
	});
}

export function startGame(
	words: string[], 
	wordsEn: string[],
	hints: Record<string, string[]>,
	hintsEn: Record<string, string[]>,
	selectedCategoryId?: string,
	impostorIndices?: number[],
	playerWords?: string[],
	playerWordsEn?: string[],
) {
	const state = gameStore.get();
	if (state.players.length < 3 || (!state.selectedCategory && !state.randomCategory && !state.crazyMode)) {
		return;
	}
	
	// If a category ID is provided (from random selection), save it to the store
	const categoryToSave = selectedCategoryId || state.selectedCategory;

	// For crazy mode, use provided player words and impostor indices
	if (state.crazyMode && playerWords && playerWordsEn && impostorIndices) {
		// Select random starting player
		const randomStartingPlayer = Math.floor(Math.random() * state.players.length);
		
		// Select random direction (left or right)
		const randomDirection = Math.random() < 0.5 ? 'left' : 'right';

		gameStore.set({
			...state,
			selectedCategory: categoryToSave,
			secretWord: '', // Not used in crazy mode
			secretWordEn: '', // Not used in crazy mode
			secretWords: playerWords,
			secretWordsEn: playerWordsEn,
			secretWordHints: hints,
			secretWordHintsEn: hintsEn,
			impostorIndices: impostorIndices,
			currentPlayerIndex: randomStartingPlayer,
			startingPlayerIndex: randomStartingPlayer,
			gameDirection: randomDirection,
			gameStarted: true,
			gameFinished: false,
		});
		return;
	}

	// Normal mode: single word for all players
	if (words.length === 0) {
		return;
	}

	// Select a random index to ensure we get the same word in both languages
	const randomIndex = Math.floor(Math.random() * words.length);
	const randomWord = words[randomIndex];
	const randomWordEn = wordsEn[randomIndex];
	
	// Select random impostors (ensure we don't select more impostors than players)
	const maxImpostors = Math.min(state.numberOfImpostors, state.players.length - 1);
	const normalImpostorIndices: number[] = [];
	
	while (normalImpostorIndices.length < maxImpostors) {
		const randomIndex = Math.floor(Math.random() * state.players.length);
		if (!normalImpostorIndices.includes(randomIndex)) {
			normalImpostorIndices.push(randomIndex);
		}
	}

	// Select random starting player
	const randomStartingPlayer = Math.floor(Math.random() * state.players.length);
	
	// Select random direction (left or right)
	const randomDirection = Math.random() < 0.5 ? 'left' : 'right';

	gameStore.set({
		...state,
		selectedCategory: categoryToSave, // Save the selected category (random or manual)
		secretWord: randomWord,
		secretWordEn: randomWordEn,
		secretWords: [],
		secretWordsEn: [],
		secretWordHints: hints,
		secretWordHintsEn: hintsEn,
		impostorIndices: normalImpostorIndices,
		currentPlayerIndex: randomStartingPlayer,
		startingPlayerIndex: randomStartingPlayer,
		gameDirection: randomDirection,
		gameStarted: true,
		gameFinished: false,
	});
}

export function nextPlayer() {
	const state = gameStore.get();
	
	// Calculate next player index based on direction
	let nextIndex: number;
	if (state.gameDirection === 'right') {
		// Move to the right (increment, wrap around)
		nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
	} else {
		// Move to the left (decrement, wrap around)
		nextIndex = (state.currentPlayerIndex - 1 + state.players.length) % state.players.length;
	}
	
	// Finish the game when we've completed a full cycle back to the starting player
	// Since the starting player already played, we finish when we return to them
	if (nextIndex === state.startingPlayerIndex) {
		gameStore.set({
			...state,
			gameFinished: true,
		});
	} else {
		gameStore.set({
			...state,
			currentPlayerIndex: nextIndex,
		});
	}
}

export function resetGame() {
	const state = gameStore.get();
	gameStore.set({
		...state,
		selectedCategory: null,
		randomCategory: false,
		secretWord: '',
		secretWordEn: '',
		secretWords: [],
		secretWordsEn: [],
		secretWordHints: {},
		secretWordHintsEn: {},
		impostorIndices: [],
		currentPlayerIndex: 0,
		startingPlayerIndex: 0,
		gameDirection: 'right',
		gameStarted: false,
		gameFinished: false,
		impostorHintsEnabled: false,
		crazyMode: false,
	});
}

export function resetAll() {
	gameStore.set({
		players: [],
		selectedCategory: null,
		randomCategory: false,
		impostorHintsEnabled: false,
		crazyMode: false,
		numberOfImpostors: 1,
		secretWord: '',
		secretWordEn: '',
		secretWords: [],
		secretWordsEn: [],
		secretWordHints: {},
		secretWordHintsEn: {},
		impostorIndices: [],
		currentPlayerIndex: 0,
		startingPlayerIndex: 0,
		gameDirection: 'right',
		gameStarted: false,
		gameFinished: false,
		gameMode: 'international',
	});
}

