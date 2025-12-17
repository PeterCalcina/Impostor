import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, startGame } from '../stores/gameStore';
import GameSetup from './GameSetup';
import GameScreen from './GameScreen';
import GameFinal from './GameFinal';

interface CategoryData {
	id: string;
	words: string[];
}

export default function GameApp({ categories }: { categories: CategoryData[] }) {
	const game = useStore(gameStore);

	const handleStart = () => {
		const currentGame = gameStore.get();
		
		// Validaciones
		if (!currentGame.selectedCategory) {
			alert('Por favor selecciona una categoría');
			return;
		}
		
		if (!categories || categories.length === 0) {
			alert('Error: No se cargaron las categorías correctamente');
			return;
		}
		
		// Buscar la categoría seleccionada directamente en el array
		const selectedCategory = categories.find(cat => cat.id === currentGame.selectedCategory);
		
		if (!selectedCategory || !selectedCategory.words || selectedCategory.words.length === 0) {
			alert(`Error: No se encontraron palabras para la categoría ${currentGame.selectedCategory}`);
			return;
		}
		
		startGame(selectedCategory.words);
	};

	const handleReveal = () => {
		// La palabra ya se revela en el componente GameFinal
	};

	const handlePlayAgain = () => {
		// El reset ya se hace en GameFinal
	};

	if (game.gameFinished) {
		return <GameFinal onReveal={handleReveal} onPlayAgain={handlePlayAgain} />;
	}

	if (game.gameStarted) {
		return <GameScreen />;
	}

	return <GameSetup onStart={handleStart} />;
}

