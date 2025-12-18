import { useStore } from "@nanostores/react";
import { gameStore, setNumberOfImpostors } from "../../stores/gameStore";
import { useLanguage } from "../../hooks/useLanguage";

export function ImpostorSelector() {
  const game = useStore(gameStore);
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold">
        {t("gameSetup.numberOfImpostors")}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((count) => {
          const maxImpostors = Math.max(
            1,
            Math.floor(game.players.length / 2)
          );
          const isDisabled =
            count > maxImpostors || count >= game.players.length;
          return (
            <button
              key={count}
              onClick={() => setNumberOfImpostors(count)}
              disabled={isDisabled}
              className={
                game.numberOfImpostors === count
                  ? "btn-base btn-category-active"
                  : isDisabled
                  ? "btn-disabled"
                  : "btn-base btn-category-inactive"
              }
            >
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
