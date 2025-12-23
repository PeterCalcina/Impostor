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
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-white">
        {t("gameSetup.addPlayer")}
      </h2>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter player name"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          onClick={handleAddPlayer} 
          className="bg-blue-600 hover:bg-blue-700 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
