import { useStore } from "@nanostores/react";
import { gameStore, removePlayer } from "../../stores/gameStore";
import { X, Shuffle, Trash } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function PlayersList() {
  const game = useStore(gameStore);
  const { t } = useLanguage();

  const mixPlayers = () => {
    const players = game.players;
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    gameStore.set({ ...game, players });
  };

  const resetPlayers = () => {
    gameStore.set({ ...game, players: [] });
  };

  if (game.players.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-semibold">
          {t("gameSetup.players")} ({game.players.length})
        </label>

        <div className="flex items-center gap-2">
          <button onClick={() => mixPlayers()} className="btn-base btn-sm">
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={() => resetPlayers()}
            className="btn-base btn-sm bg-red-500!"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {game.players.map((player) => (
          <div
            key={player}
            className="bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between animate-slide-in"
          >
            <span className="text-white">{player}</span>
            <button
              onClick={() => removePlayer(player)}
              className="btn-icon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
