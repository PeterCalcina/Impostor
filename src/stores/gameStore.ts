import { atom } from 'nanostores';

export interface GameState {
	players: string[];
	selectedCategory: string | null;
	numberOfImpostors: number;
	secretWord: string | null;
	impostorIndices: number[];
	currentPlayerIndex: number;
	gameStarted: boolean;
	gameFinished: boolean;
	gameMode: 'international' | 'national';
}

export const gameStore = atom<GameState>({
	players: [],
	selectedCategory: null,
	numberOfImpostors: 1,
	secretWord: null,
	impostorIndices: [],
	currentPlayerIndex: 0,
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

export function startGame(words: string[]) {
	const state = gameStore.get();
	if (state.players.length < 3 || !state.selectedCategory || words.length === 0) {
		return;
	}

	const randomWord = words[Math.floor(Math.random() * words.length)];
	
	// Select random impostors (ensure we don't select more impostors than players)
	const maxImpostors = Math.min(state.numberOfImpostors, state.players.length - 1);
	const impostorIndices: number[] = [];
	
	while (impostorIndices.length < maxImpostors) {
		const randomIndex = Math.floor(Math.random() * state.players.length);
		if (!impostorIndices.includes(randomIndex)) {
			impostorIndices.push(randomIndex);
		}
	}

	gameStore.set({
		...state,
		secretWord: randomWord,
		impostorIndices: impostorIndices,
		currentPlayerIndex: 0,
		gameStarted: true,
		gameFinished: false,
	});
}

export function nextPlayer() {
	const state = gameStore.get();
	if (state.currentPlayerIndex < state.players.length - 1) {
		gameStore.set({
			...state,
			currentPlayerIndex: state.currentPlayerIndex + 1,
		});
	} else {
		gameStore.set({
			...state,
			gameFinished: true,
		});
	}
}

export function resetGame() {
	const state = gameStore.get();
	gameStore.set({
		...state,
		selectedCategory: null,
		secretWord: null,
		impostorIndices: [],
		currentPlayerIndex: 0,
		gameStarted: false,
		gameFinished: false,
	});
}

export function resetAll() {
	gameStore.set({
		players: [],
		selectedCategory: null,
		numberOfImpostors: 1,
		secretWord: null,
		impostorIndices: [],
		currentPlayerIndex: 0,
		gameStarted: false,
		gameFinished: false,
		gameMode: 'international',
	});
}

