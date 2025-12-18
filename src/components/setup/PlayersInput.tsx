import { useState } from "react";
import { useStore } from "@nanostores/react";
import { gameStore, addPlayer } from "../../stores/gameStore";
import { Plus } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function PlayersInput() {
  const game = useStore(gameStore);
  const { t } = useLanguage();
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      addPlayer(playerName);
      setPlayerName("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold">
        {t("gameSetup.addPlayer")}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t("gameSetup.playerName")}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <button onClick={handleAddPlayer} className="btn-sm">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {game.players.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {game.players.length < 3
            ? t("gameSetup.needMorePlayers")
            : `Max Impostors: ${Math.max(1, Math.floor(game.players.length / 2))}`}
        </p>
      )}
    </div>
  );
}
