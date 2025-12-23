import { useStore } from "@nanostores/react";
import { gameStore, setGameMode } from "../../stores/gameStore";
import { useLanguage } from "../../hooks/useLanguage";

export function GameModeToggle() {
  const game = useStore(gameStore);
  const { t } = useLanguage();

  const handleModeChange = (mode: 'international' | 'national') => {
    setGameMode(mode);
  };

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

