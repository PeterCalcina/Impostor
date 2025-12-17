import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { gameStore, addPlayer, removePlayer, setCategory } from '../stores/gameStore';
import { X, Plus } from 'lucide-react';

const categories = [
	{ id: 'fiesta', name: 'Fiesta' },
	{ id: 'comida', name: 'Comida' },
	{ id: 'bebida', name: 'Bebida' },
	{ id: 'animales', name: 'Animales' },
	{ id: 'deportes', name: 'Deportes' },
	{ id: 'plus18', name: '+18' },
];

export default function GameSetup({ onStart }: { onStart: () => void }) {
	const game = useStore(gameStore);
	const [playerName, setPlayerName] = useState('');

	const handleAddPlayer = () => {
		if (playerName.trim()) {
			addPlayer(playerName);
			setPlayerName('');
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddPlayer();
		}
	};

	const canStart = game.players.length >= 3 && game.selectedCategory !== null;

	return (
		<div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
			<div className="w-full max-w-md space-y-8 animate-fade-in">
				<h1 className="text-4xl font-bold text-center mb-8">El Impostor</h1>

				{/* Input de Jugadores */}
				<div className="space-y-4">
					<label className="block text-lg font-semibold">Añadir Jugador</label>
					<div className="flex gap-2">
						<input
							type="text"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Nombre del jugador"
							className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
						/>
						<button
							onClick={handleAddPlayer}
							className="bg-purple-600 hover:bg-purple-700 rounded-2xl px-6 py-3 transition-all transform hover:scale-105 active:scale-95"
						>
							<Plus className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Lista de Jugadores */}
				{game.players.length > 0 && (
					<div className="space-y-2">
						<label className="block text-lg font-semibold">Jugadores ({game.players.length})</label>
						<div className="space-y-2 max-h-48 overflow-y-auto">
							{game.players.map((player) => (
								<div
									key={player}
									className="bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between animate-slide-in"
								>
									<span className="text-white">{player}</span>
									<button
										onClick={() => removePlayer(player)}
										className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-500/10"
									>
										<X className="w-5 h-5" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Selector de Categorías */}
				<div className="space-y-4">
					<label className="block text-lg font-semibold">Selecciona una Categoría</label>
					<div className="grid grid-cols-2 gap-3">
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setCategory(category.id)}
								className={`rounded-2xl px-4 py-4 font-semibold transition-all transform active:scale-95 ${
									game.selectedCategory === category.id
										? 'bg-purple-600 text-white scale-105 shadow-lg shadow-purple-500/50'
										: 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800'
								}`}
							>
								{category.name}
							</button>
						))}
					</div>
				</div>

				{/* Botón Empezar */}
				<button
					onClick={onStart}
					disabled={!canStart}
					className={`w-full rounded-2xl px-6 py-4 font-bold text-lg transition-all transform ${
						canStart
							? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white scale-100 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/50'
							: 'bg-gray-800 text-gray-500 cursor-not-allowed'
					}`}
				>
					Empezar
				</button>
			</div>
		</div>
	);
}

