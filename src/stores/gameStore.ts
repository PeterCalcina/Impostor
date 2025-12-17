import { atom } from 'nanostores';

export interface GameState {
	players: string[];
	selectedCategory: string | null;
	secretWord: string | null;
	impostorIndex: number | null;
	currentPlayerIndex: number;
	gameStarted: boolean;
	gameFinished: boolean;
}

export const gameStore = atom<GameState>({
	players: [],
	selectedCategory: null,
	secretWord: null,
	impostorIndex: null,
	currentPlayerIndex: 0,
	gameStarted: false,
	gameFinished: false,
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

export function startGame(words: string[]) {
	const state = gameStore.get();
	if (state.players.length < 3 || !state.selectedCategory || words.length === 0) {
		return;
	}

	const randomWord = words[Math.floor(Math.random() * words.length)];
	const randomImpostor = Math.floor(Math.random() * state.players.length);

	gameStore.set({
		...state,
		secretWord: randomWord,
		impostorIndex: randomImpostor,
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
		impostorIndex: null,
		currentPlayerIndex: 0,
		gameStarted: false,
		gameFinished: false,
	});
}

export function resetAll() {
	gameStore.set({
		players: [],
		selectedCategory: null,
		secretWord: null,
		impostorIndex: null,
		currentPlayerIndex: 0,
		gameStarted: false,
		gameFinished: false,
	});
}

