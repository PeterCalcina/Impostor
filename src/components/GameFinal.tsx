import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, resetGame } from '../stores/gameStore';
import { Eye, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function GameFinal({ onReveal, onPlayAgain }: { onReveal: () => void; onPlayAgain: () => void }) {
	const game = useStore(gameStore);
	const { t } = useLanguage();
	const [wordRevealed, setWordRevealed] = useState(false);

	const handleReveal = () => {
		setWordRevealed(true);
		onReveal();
	};

	const handlePlayAgain = () => {
		resetGame();
		setWordRevealed(false);
		onPlayAgain();
	};

	return (
		<div className="bg-black text-white p-6 flex flex-col items-center justify-center min-h-2/3">
			<div className="w-full max-w-md space-y-8 text-center animate-fade-in">
				<h1 className="text-4xl font-bold mb-8">{t('gameFinal.gameFinished')}</h1>

				{wordRevealed ? (
					<div className="space-y-6">
						<div className="space-y-2">
							<p className="text-gray-400 text-sm uppercase tracking-wider">{t('gameFinal.secretWordWas')}</p>
							<div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl px-8 py-12 text-4xl font-bold">
								{game.secretWord}
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-gray-400 text-sm uppercase tracking-wider">
								{game.impostorIndices.length === 1 ? t('gameFinal.impostorWas') : t('gameFinal.impostorsWere')}
							</p>
							<div className="bg-linear-to-r from-red-600 to-orange-600 rounded-2xl px-6 py-4 text-2xl font-bold">
								{game.impostorIndices.map((idx) => game.players[idx]).join(', ')}
							</div>
						</div>
					</div>
				) : (
					<p className="text-gray-400 text-lg">{t('gameFinal.wantToReveal')}</p>
				)}

				<div className="space-y-4">
					{!wordRevealed && (
						<button
							onClick={handleReveal}
							className="w-full btn-primary-lg flex items-center justify-center gap-3"
						>
							<Eye className="w-6 h-6" />
							<span>{t('gameFinal.revealWord')}</span>
						</button>
					)}
					<button
						onClick={handlePlayAgain}
						className="w-full btn-secondary-lg flex items-center justify-center gap-3"
					>
						<RotateCcw className="w-6 h-6" />
						<span>{t('gameFinal.playAgain')}</span>
					</button>
				</div>
			</div>
		</div>
	);
}

