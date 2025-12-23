import { useStore } from "@nanostores/react";
import { gameStore, removePlayer } from "../../stores/gameStore";
import { X, Shuffle, Trash, Users } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function PlayersList() {
  const game = useStore(gameStore);
  const { t } = useLanguage();

  const mixPlayers = () => {
    const players = [...game.players];
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
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <h2 className="text-base sm:text-lg font-semibold text-white">
            {t("gameSetup.players")}
          </h2>
          <span className="text-white text-sm sm:text-base">{game.players.length}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => mixPlayers()} 
            className="flex-1 sm:flex-none bg-gray-900 hover:bg-gray-700 rounded-xl px-3 sm:px-4 py-2 flex items-center justify-center gap-2 text-white transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={() => resetPlayers()}
            className="flex-1 sm:flex-none bg-pink-600 hover:bg-pink-700 rounded-xl px-3 sm:px-4 py-2 flex items-center justify-center gap-2 text-white transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {game.players.map((player, index) => (
          <div
            key={player}
            className="flex items-center justify-between animate-slide-in bg-gray-800/50 rounded-xl px-3 sm:px-4 py-2 hover:bg-gray-800/70 transition-all"
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs sm:text-sm shrink-0">
                {index + 1}
              </div>
              <span className="text-gray-400 text-sm sm:text-base truncate">{player}</span>
            </div>
            <button
              onClick={() => removePlayer(player)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
