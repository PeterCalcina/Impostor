import { useState } from "react";
import { useStore } from "@nanostores/react";
import { gameStore } from "../stores/gameStore";
import { useLanguage } from "../hooks/useLanguage";
import { PlayersInput } from "./setup/PlayersInput";
import { PlayersList } from "./setup/PlayersList";
import { CategorySelector } from "./setup/CategorySelector";
import { ImpostorSelector } from "./setup/ImpostorSelector";
import { ConfirmationDialog } from "./setup/ConfirmationDialog";
import type { CategoryData } from "./interfaces/CategoryData.interface";

export default function GameSetup({
  onStart,
  internationalCategories,
  nationalCategories,
}: {
  onStart: () => void;
  internationalCategories: CategoryData[];
  nationalCategories: CategoryData[];
}) {
  const game = useStore(gameStore);
  const { t } = useLanguage();
  const [showSpicyDialog, setShowSpicyDialog] = useState(false);

  const canStart = game.players.length >= 3 && (game.selectedCategory !== null || game.randomCategory || game.crazyMode);
  const isSpicy =
    game.selectedCategory === "spicy" ? "btn-warning" : "btn-primary-md";

  const handleStartClick = () => {
    // Check if selected category is spicy (only if not random)
    if (!game.randomCategory && game.selectedCategory === "spicy") {
      setShowSpicyDialog(true);
    } else {
      onStart();
    }
  };

  const handleConfirm = () => {
    setShowSpicyDialog(false);
    onStart();
  };

  const handleCancel = () => {
    setShowSpicyDialog(false);
  };

  return (
    <>
      <div className="bg-gray-950 text-white p-4 sm:p-6 flex flex-col items-center justify-center min-h-2/3">
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <PlayersInput />
            <ImpostorSelector />
          </div>
          <PlayersList />
          <CategorySelector
            internationalCategories={internationalCategories}
            nationalCategories={nationalCategories}
          />

          {/* Start button */}
          <button
            onClick={handleStartClick}
            disabled={!canStart}
            className={`w-full btn-base text-base sm:text-lg px-4 sm:px-6 py-3 sm:py-4 ${canStart ? isSpicy : "btn-disabled"}`}
          >
            {t("gameSetup.start")}
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showSpicyDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
