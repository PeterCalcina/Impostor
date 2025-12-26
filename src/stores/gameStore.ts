import { atom } from 'nanostores';

export interface GameState {
	players: string[];
	selectedCategory: string | null;
	randomCategory: boolean;
	numberOfImpostors: number;
	secretWord: string;
	secretWordEn: string;
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
	numberOfImpostors: 1,
	secretWord: '',
	secretWordEn: '',
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
	gameStore.set({
		...state,
		selectedCategory: category,
		randomCategory: false, // Disable random when manually selecting a category
	});
}

export function setRandomCategory(enabled: boolean) {
	const state = gameStore.get();
	gameStore.set({
		...state,
		randomCategory: enabled,
		selectedCategory: enabled ? null : state.selectedCategory, // Clear selection when enabling random
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
) {
	const state = gameStore.get();
	if (state.players.length < 3 || (!state.selectedCategory && !state.randomCategory) || words.length === 0) {
		return;
	}
	
	// If a category ID is provided (from random selection), save it to the store
	const categoryToSave = selectedCategoryId || state.selectedCategory;

	// Select a random index to ensure we get the same word in both languages
	const randomIndex = Math.floor(Math.random() * words.length);
	const randomWord = words[randomIndex];
	const randomWordEn = wordsEn[randomIndex];
	
	// Select random impostors (ensure we don't select more impostors than players)
	const maxImpostors = Math.min(state.numberOfImpostors, state.players.length - 1);
	const impostorIndices: number[] = [];
	
	while (impostorIndices.length < maxImpostors) {
		const randomIndex = Math.floor(Math.random() * state.players.length);
		if (!impostorIndices.includes(randomIndex)) {
			impostorIndices.push(randomIndex);
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
		secretWordHints: hints,
		secretWordHintsEn: hintsEn,
		impostorIndices: impostorIndices,
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
		secretWordHints: {},
		secretWordHintsEn: {},
		impostorIndices: [],
		currentPlayerIndex: 0,
		startingPlayerIndex: 0,
		gameDirection: 'right',
		gameStarted: false,
		gameFinished: false,
	});
}

export function resetAll() {
	gameStore.set({
		players: [],
		selectedCategory: null,
		randomCategory: false,
		numberOfImpostors: 1,
		secretWord: '',
		secretWordEn: '',
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

