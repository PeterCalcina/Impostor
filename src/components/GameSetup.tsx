import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  gameStore,
  addPlayer,
  removePlayer,
  setCategory,
} from "../stores/gameStore";
import { X, Plus } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

const categories = [
  { id: "fiesta", nameKey: "categories.fiesta" },
  { id: "comida", nameKey: "categories.comida" },
  { id: "bebida", nameKey: "categories.bebida" },
  { id: "animales", nameKey: "categories.animales" },
  { id: "deportes", nameKey: "categories.deportes" },
  { id: "plus18", nameKey: "categories.plus18" },
];

export default function GameSetup({ onStart }: { onStart: () => void }) {
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

  const canStart = game.players.length >= 3 && game.selectedCategory !== null;

  return (
    <div className="bg-black text-white p-6 flex flex-col items-center justify-center min-h-2/3">
      <div className="w-full max-w-md space-y-8 animate-fade-in">

        {/* Input de Jugadores */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold">{t("gameSetup.addPlayer")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("gameSetup.playerName")}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={handleAddPlayer}
              className="btn-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Jugadores */}
        {game.players.length > 0 && (
          <div className="space-y-2">
            <label className="block text-lg font-semibold">
              {t("gameSetup.players")} ({game.players.length})
            </label>
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

        {/* Selector de Categorías */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold">
            {t("gameSetup.selectCategory")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategory(category.id)}
                className={
                  game.selectedCategory === category.id
                    ? "btn-category-active"
                    : "btn-category-inactive"
                }
              >
                {t(category.nameKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Empezar */}
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`w-full ${canStart ? "btn-primary-md" : "btn-disabled"}`}
        >
          {t("gameSetup.start")}
        </button>
      </div>
    </div>
  );
}
