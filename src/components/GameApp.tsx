import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, startGame } from '../stores/gameStore';
import GameSetup from './GameSetup';
import GameScreen from './GameScreen';
import GameFinal from './GameFinal';
import { useLanguage } from '../hooks/useLanguage';

interface CategoryData {
	id: string;
	words: string[];
	words_en: string[] | null;
}

export default function GameApp({ categories }: { categories: CategoryData[] }) {
	const game = useStore(gameStore);
	const { t, language } = useLanguage();

	const handleStart = () => {
		const currentGame = gameStore.get();
		
		// Validaciones
		if (!currentGame.selectedCategory) {
			alert(t('gameApp.selectCategory'));
			return;
		}
		
		if (!categories || categories.length === 0) {
			alert(t('gameApp.categoriesError'));
			return;
		}
		
		// Buscar la categoría seleccionada directamente en el array
		const selectedCategory = categories.find(cat => cat.id === currentGame.selectedCategory);
		
		if (!selectedCategory) {
			alert(`${t('gameApp.categoryWordsError')} ${currentGame.selectedCategory}`);
			return;
		}
		
		// Use English words if available and language is English, otherwise use Spanish
		const words = language === 'en' && selectedCategory.words_en && selectedCategory.words_en.length > 0
			? selectedCategory.words_en
			: selectedCategory.words;
		
		if (!words || words.length === 0) {
			alert(`${t('gameApp.categoryWordsError')} ${currentGame.selectedCategory}`);
			return;
		}
		
		startGame(words);
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

