import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, resetGame } from '../stores/gameStore';
import { Eye, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { categories } from './setup/categories';

export default function GameFinal({ onReveal, onPlayAgain }: { onReveal: () => void; onPlayAgain: () => void }) {
	const game = useStore(gameStore);
	const { t, language } = useLanguage();
	const [wordRevealed, setWordRevealed] = useState(false);
	
	const secretWord = language === 'en' && game.secretWordEn ? game.secretWordEn : game.secretWord;

	const handleReveal = () => {
		setWordRevealed(true);
		onReveal();
	};

	const handlePlayAgain = () => {
		resetGame();
		setWordRevealed(false);
		onPlayAgain();
	};

	const startingPlayer = game.players[game.startingPlayerIndex];
	const directionText = game.gameDirection === 'left' ? t('gameFinal.directionLeft') : t('gameFinal.directionRight');
	
	// Get category name from selected category ID
	const categoryInfo = categories.find(cat => cat.id === game.selectedCategory);
	const categoryName = categoryInfo ? t(categoryInfo.nameKey) : game.selectedCategory || '';

	return (
		<div className="bg-gray-950 text-white p-4 sm:p-6 flex flex-col items-center justify-center min-h-2/3">
			<div className="w-full max-w-md space-y-4 sm:space-y-8 text-center animate-fade-in">
				<div className="space-y-4 sm:space-y-6 mb-4 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
						{t('gameFinal.gameStartedBy')}: {startingPlayer}
					</h1>
					<p className="text-lg sm:text-xl font-semibold text-gray-300">
						{t('gameFinal.direction')}: {directionText}
					</p>
				</div>

				{wordRevealed ? (
					<div className="space-y-4 sm:space-y-6">
						<div className="space-y-2 sm:space-y-3">
							<p className="text-gray-400 text-sm uppercase tracking-wider">{t('gameFinal.secretWordWas')}</p>
							<div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl px-6 py-10 text-2xl sm:text-3xl font-bold">
								{secretWord}
							</div>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
							<div className="flex-1 space-y-2 sm:space-y-3">
								<p className="text-gray-400 text-sm uppercase tracking-wider">{t('gameFinal.categoryWas')}</p>
								<div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl px-6 py-6 text-lg sm:text-xl font-bold">
									{categoryInfo?.icon && <span className="mr-2">{categoryInfo.icon}</span>}
									{categoryName}
								</div>
							</div>
							<div className="flex-1 space-y-2 sm:space-y-3">
								<p className="text-gray-400 text-sm uppercase tracking-wider">
									{game.impostorIndices.length === 1 ? t('gameFinal.impostorWas') : t('gameFinal.impostorsWere')}
								</p>
								<div className="bg-linear-to-r from-red-600 to-orange-600 rounded-2xl px-6 py-6 text-lg sm:text-xl font-bold">
									{game.impostorIndices.map((idx) => game.players[idx]).join(', ')}
								</div>
							</div>
						</div>
					</div>
				) : (
					<p className="text-gray-400 text-base sm:text-lg">{t('gameFinal.wantToReveal')}</p>
				)}

				<div className="space-y-4">
					{!wordRevealed && (
						<button
							onClick={handleReveal}
							className="w-full btn-base btn-primary-lg text-sm sm:text-base flex items-center justify-center gap-3 rounded-xl"
						>
							<Eye className="w-4 h-4 sm:w-6 sm:h-6" />
							<span>{t('gameFinal.revealWord')}</span>
						</button>
					)}
					<button
						onClick={handlePlayAgain}
						className="w-full btn-base btn-secondary-lg text-sm sm:text-base flex items-center justify-center gap-3 rounded-xl"
					>
						<RotateCcw className="w-4 h-4 sm:w-6 sm:h-6" />
						<span>{t('gameFinal.playAgain')}</span>
					</button>
				</div>
			</div>
		</div>
	);
}

