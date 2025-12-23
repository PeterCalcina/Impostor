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

  const canStart = game.players.length >= 3 && game.selectedCategory !== null;
  const isSpicy =
    game.selectedCategory === "spicy" ? "btn-warning" : "btn-primary-md";

  const handleStartClick = () => {
    if (game.selectedCategory === "spicy") {
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
      <div className="bg-black text-white p-6 flex flex-col items-center justify-center min-h-2/3">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <PlayersInput />
          <PlayersList />
          <CategorySelector
            internationalCategories={internationalCategories}
            nationalCategories={nationalCategories}
          />
          <ImpostorSelector />

          {/* Start button */}
          <button
            onClick={handleStartClick}
            disabled={!canStart}
            className={`w-full btn-base ${canStart ? isSpicy : "btn-disabled"}`}
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
