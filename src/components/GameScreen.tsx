import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, nextPlayer, resetGame } from '../stores/gameStore';
import { Eye, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function GameScreen() {
	const game = useStore(gameStore);
	const { t, language } = useLanguage();
	const [showWord, setShowWord] = useState(false);
	const [wordRevealed, setWordRevealed] = useState(false);

	const currentPlayer = game.players[game.currentPlayerIndex];
	const isImpostor = game.impostorIndices.includes(game.currentPlayerIndex);
	
	const secretWord = language === 'en' ? game.secretWordEn : game.secretWord;
	const secretWordHintsMap = language === 'en' ? game.secretWordHintsEn : game.secretWordHints;
	const secretWordHints = secretWordHintsMap[secretWord] || [];
	const displayText = isImpostor ? t('gameScreen.youAreImpostor') : secretWord;

	const handleShowWord = () => {
		setShowWord(true);
		setWordRevealed(true);
	};

	const handleHideWord = () => {
		setShowWord(false);
	};

	const handleNext = () => {
		setShowWord(false);
		setWordRevealed(false);
		nextPlayer();
	};

	const handlePlayAgain = () => {
		resetGame();
		setWordRevealed(false);
	};

	return (
		<div className="bg-gray-950 text-white p-4 sm:p-6 flex flex-col items-center justify-center min-h-2/3">
			<div className="w-full max-w-md space-y-8 text-center animate-fade-in">
				{/* Player's turn */}
				<div className="space-y-4">
					<p className="text-gray-400 text-sm uppercase tracking-wider">{t('gameScreen.turnOf')}</p>
					<h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
						{currentPlayer}
					</h2>
				</div>

				{/* Button to view word / show word */}
				<div className="space-y-6">
					{!wordRevealed ? (
						<button
							onClick={handleShowWord}
							onMouseDown={handleShowWord}
							onTouchStart={handleShowWord}
							onMouseUp={handleHideWord}
							onMouseLeave={handleHideWord}
							onTouchEnd={handleHideWord}
							className="w-full btn-base btn-primary-lg"
						>
							<div className="flex items-center justify-center gap-3">
								<Eye className="w-6 h-6" />
								<span>{t('gameScreen.viewWord')}</span>
							</div>
						</button>
					) : (
						<div className="space-y-4">
							<div
								className={`w-full rounded-2xl px-8 py-12 text-3xl font-bold transition-all transform ${
									isImpostor
										? 'bg-linear-to-r from-red-600 to-orange-600 text-white animate-pulse'
										: 'bg-linear-to-r from-green-600 to-emerald-600 text-white'
								}`}
							>
								{displayText}
							</div>
							{isImpostor && secretWordHints.length > 0 && (
								<div className="w-full rounded-2xl px-6 py-6 bg-gray-800 border border-gray-700">
									<p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
										{t('gameScreen.hints')}
									</p>
									<ul className="space-y-2 text-left">
										{secretWordHints.map((hint, index) => (
											<li key={index} className="text-white text-base flex items-start gap-2">
												<span className="text-gray-500 mt-1">•</span>
												<span>{hint}</span>
											</li>
										))}
									</ul>
								</div>
							)}
							<button
								onClick={handleNext}
								className="w-full btn-base btn-secondary-lg flex items-center justify-center gap-3"
							>
								<span>{t('gameScreen.nextPlayer')}</span>
								<ArrowRight className="w-6 h-6" />
							</button>
						</div>
					)}
				</div>

				{/* Progress indicator */}
				<div className="pt-4">
					<p className="text-gray-500 text-sm">
						{t('gameScreen.player')} {game.currentPlayerIndex + 1} {t('gameScreen.of')} {game.players.length}
					</p>
				</div>

				{/* Restart game */}
				<button
					onClick={handlePlayAgain}
					className="w-full btn-secondary-lg text-sm sm:text-base flex items-center justify-center gap-3 rounded-xl"
				>
					<span>{t('gameScreen.playAgain')}</span>
					<RotateCcw className="w-4 h-4 sm:w-6 sm:h-6" />
				</button>
			</div>
		</div>
	);
}

