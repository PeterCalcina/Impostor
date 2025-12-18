import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  gameStore,
  addPlayer,
  removePlayer,
  setCategory,
  setNumberOfImpostors,
} from "../stores/gameStore";
import { X, Plus, Shuffle, RotateCcw, Trash } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

const categories = [
  { id: "party", nameKey: "categories.party", icon: "🎉" },
  { id: "food", nameKey: "categories.food", icon: "🍔" },
  { id: "drinks", nameKey: "categories.drinks", icon: "🍺" },
  { id: "animals", nameKey: "categories.animals", icon: "🐶" },
  { id: "sports", nameKey: "categories.sports", icon: "🏆" },
  { id: "spicy", nameKey: "categories.spicy", icon: "🔥" },
];

export default function GameSetup({ onStart }: { onStart: () => void }) {
  const game = useStore(gameStore);
  const { t } = useLanguage();
  const [playerName, setPlayerName] = useState("");
  const [shakingCategory, setShakingCategory] = useState<string | null>(null);

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

  const canStart = game.players.length >= 3 && game.selectedCategory !== null;

  return (
    <div className="bg-black text-white p-6 flex flex-col items-center justify-center min-h-2/3">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Players input */}
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
                : `Max: ${Math.max(1, Math.floor(game.players.length / 2))}`}
            </p>
          )}
        </div>

        {/* Players list */}
        {game.players.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold">
                {t("gameSetup.players")} ({game.players.length})
              </label>

              <div className="flex items-center gap-2">
                <button onClick={() => mixPlayers()} className="btn-sm">
                  <Shuffle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => resetPlayers()}
                  className="btn-sm bg-red-500!"
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
        )}

        {/* Categories selector */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold">
            {t("gameSetup.selectCategory")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const isSpicy = category.id === "spicy";
              const isSelected = game.selectedCategory === category.id;
              const isShaking = shakingCategory === category.id;
              
              const handleCategoryClick = () => {
                setCategory(category.id);
                if (isSpicy && !isSelected) {
                  setShakingCategory(category.id);
                  setTimeout(() => setShakingCategory(null), 600);
                }
              };

              const customClass = isSpicy
                ? "bg-red-700! hover:bg-red-500! border-gray-500! shadow-red-500/50!"
                : "";
              
              const shakeClass = isShaking ? "animate-spicy-shake" : "";
              
              return (
                <button
                  key={category.id}
                  onClick={handleCategoryClick}
                  className={
                    isSelected
                      ? `btn-category-active ${customClass} ${shakeClass}`
                      : `btn-category-inactive ${customClass} ${shakeClass}`
                  }
                >
                  {category.icon} {t(category.nameKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Among Us Impostors */}
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
                      ? "btn-category-active"
                      : isDisabled
                      ? "btn-disabled"
                      : "btn-category-inactive"
                  }
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`w-full ${canStart ? "btn-primary-md" : "btn-disabled"}`}
        >
          {t("gameSetup.start")}
        </button>
      </div>

      <style>
        {`
          .animate-spicy-shake {
            animation: spicy-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
          }

          @keyframes spicy-shake {
            0%, 100% {
              transform: translateX(0) rotate(0deg);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-4px) rotate(-2deg);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(4px) rotate(2deg);
            }
          }
        `}
      </style>
    </div>
  );
}
