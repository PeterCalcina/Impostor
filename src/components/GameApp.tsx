import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, startGame } from '../stores/gameStore';
import GameSetup from './GameSetup';
import GameScreen from './GameScreen';
import GameFinal from './GameFinal';
import { useLanguage } from '../hooks/useLanguage';
import { generateCrazyModeWords, getAvailableCategoriesForCrazyMode } from '../utils/crazyMode';
import type { CategoryData } from './interfaces/CategoryData.interface';

export default function GameApp({ 
	internationalCategories, 
	nationalCategories 
}: { 
	internationalCategories: CategoryData[];
	nationalCategories: CategoryData[];
}) {
	const game = useStore(gameStore);
	const { t, language } = useLanguage();

	// Filter categories based on current game mode
	const categories = game.gameMode === 'national' ? nationalCategories : internationalCategories;

	const handleStart = () => {
		const currentGame = gameStore.get();
		
		// Get categories based on current mode
		const currentCategories = currentGame.gameMode === 'national' ? nationalCategories : internationalCategories;
		
		if (!currentCategories || currentCategories.length === 0) {
			alert(t('gameApp.categoriesError'));
			return;
		}
		
		// Handle Crazy Mode
		if (currentGame.crazyMode) {
			const availableCategories = getAvailableCategoriesForCrazyMode(currentCategories, currentGame.gameMode);
			
			if (availableCategories.length === 0) {
				alert(t('gameApp.categoriesError'));
				return;
			}
			
			try {
				const crazyWords = generateCrazyModeWords(
					currentGame.players,
					availableCategories,
					currentGame.numberOfImpostors
				);
				
				// Merge all hints from all categories used
				const allHints: Record<string, string[]> = {};
				const allHintsEn: Record<string, string[]> = {};
				
				availableCategories.forEach(cat => {
					if (cat.hints) {
						Object.assign(allHints, cat.hints);
					}
					if (cat.hints_en) {
						Object.assign(allHintsEn, cat.hints_en);
					}
				});
				
				// Add hints from generated words
				Object.assign(allHints, crazyWords.hints);
				Object.assign(allHintsEn, crazyWords.hintsEn);
				
				startGame(
					[], // Not used in crazy mode
					[], // Not used in crazy mode
					allHints,
					allHintsEn,
					'crazy', // Special category ID for crazy mode
					crazyWords.impostorIndices,
					crazyWords.words,
					crazyWords.wordsEn
				);
			} catch (error) {
				alert(error instanceof Error ? error.message : t('gameApp.categoriesError'));
				return;
			}
			return;
		}
		
		let selectedCategory;
		
		// If random category is enabled, select a random category
		if (currentGame.randomCategory) {
			const randomIndex = Math.floor(Math.random() * currentCategories.length);
			selectedCategory = currentCategories[randomIndex];
		} else {
			// Validaciones
			if (!currentGame.selectedCategory) {
				alert(t('gameApp.selectCategory'));
				return;
			}
			
			// Buscar la categoría seleccionada directamente en el array
			selectedCategory = currentCategories.find(cat => cat.id === currentGame.selectedCategory);
			
			if (!selectedCategory) {
				alert(`${t('gameApp.categoryWordsError')} ${currentGame.selectedCategory}`);
				return;
			}
		}
		
		if (!selectedCategory.words || selectedCategory.words.length === 0) {
			alert(`${t('gameApp.categoryWordsError')} ${selectedCategory.id}`);
			return;
		}
		
		startGame(selectedCategory.words, selectedCategory.words_en, selectedCategory.hints, selectedCategory.hints_en, selectedCategory.id);
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

	return <GameSetup onStart={handleStart} internationalCategories={internationalCategories} nationalCategories={nationalCategories} />;
}

