import { useStore } from "@nanostores/react";
import { gameStore, setGameMode } from "../../stores/gameStore";
import { useLanguage } from "../../hooks/useLanguage";
import type { GameModeToggleProps } from "../interfaces/GameMode.interface";

export function GameModeToggle({ showLabel = false }: GameModeToggleProps) {
  const game = useStore(gameStore);
  const { t } = useLanguage();

  const handleModeChange = (mode: 'international' | 'national') => {
    setGameMode(mode);
  };

  if (showLabel) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {t("gameSetup.gameMode.national")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Enable region-specific content
          </p>
        </div>
        <label className="inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={game.gameMode === 'national'}
            onChange={(e) => handleModeChange(e.target.checked ? 'national' : 'international')}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    );
  }

  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="select-none text-xl font-medium text-white">
        🌍
      </span>
      <input
        type="checkbox"
        checked={game.gameMode === 'national'}
        onChange={(e) => handleModeChange(e.target.checked ? 'national' : 'international')}
        className="sr-only peer"
      />
      <div className="relative mx-3 w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
      <span className="select-none text-sm font-medium text-white">
        {t("gameSetup.gameMode.national")}
      </span>
    </label>
  );
}

