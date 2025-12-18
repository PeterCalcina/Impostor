import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, nextPlayer, resetGame } from '../stores/gameStore';
import { Eye, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function GameScreen() {
	const game = useStore(gameStore);
	const { t } = useLanguage();
	const [showWord, setShowWord] = useState(false);
	const [wordRevealed, setWordRevealed] = useState(false);

	const currentPlayer = game.players[game.currentPlayerIndex];
	const isImpostor = game.currentPlayerIndex === game.impostorIndex;
	const displayText = isImpostor ? t('gameScreen.youAreImpostor') : game.secretWord || '';

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
		<div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
			<div className="w-full max-w-md space-y-8 text-center animate-fade-in">
				{/* Player's turn */}
				<div className="space-y-4">
					<p className="text-gray-400 text-sm uppercase tracking-wider">{t('gameScreen.turnOf')}</p>
					<h2 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
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
							className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl px-8 py-6 text-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-purple-500/50"
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
							<button
								onClick={handleNext}
								className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl px-8 py-6 text-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
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
					className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl px-8 py-6 text-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
				>
					<span>{t('gameScreen.playAgain')}</span>
					<RotateCcw className="w-6 h-6" />
				</button>
			</div>
		</div>
	);
}

