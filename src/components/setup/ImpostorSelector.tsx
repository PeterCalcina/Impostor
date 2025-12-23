import { useStore } from "@nanostores/react";
import { gameStore, setNumberOfImpostors } from "../../stores/gameStore";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function ImpostorSelector() {
  const game = useStore(gameStore);
  const { t } = useLanguage();

  const maxImpostors = Math.max(1, Math.floor(game.players.length / 2));

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs sm:text-sm">
          Max Impostors: {maxImpostors}
        </span>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        {[1, 2, 3, 4].map((count) => {
          const isDisabled = count > maxImpostors || count >= game.players.length;
          const isSelected = game.numberOfImpostors === count;
          
          return (
            <button
              key={count}
              onClick={() => !isDisabled && setNumberOfImpostors(count)}
              disabled={isDisabled}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? "bg-blue-600 text-white cursor-pointer"
                  : isDisabled
                  ? "bg-gray-900 text-gray-600 cursor-not-allowed"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-700 cursor-pointer"
              }`}
            >
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
