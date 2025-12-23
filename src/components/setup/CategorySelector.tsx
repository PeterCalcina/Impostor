import { useState } from "react";
import { useStore } from "@nanostores/react";
import { gameStore, setCategory, setRandomCategory } from "../../stores/gameStore";
import { useLanguage } from "../../hooks/useLanguage";
import { categories } from "./categories";
import { GameModeToggle } from "./GameModeToggle";
import type { CategoryData } from "../interfaces/CategoryData.interface";

export function CategorySelector({ 
	internationalCategories, 
	nationalCategories 
}: { 
	internationalCategories: CategoryData[];
	nationalCategories: CategoryData[];
}) {
  const game = useStore(gameStore);
  const { t } = useLanguage();
  const [shakingCategory, setShakingCategory] = useState<string | null>(null);

  // Filter available categories based on current mode
  const availableCategories = game.gameMode === 'national' 
    ? nationalCategories.map(cat => cat.id)
    : internationalCategories.map(cat => cat.id);

  // Filter category definitions to only show available ones
  const filteredCategories = categories.filter(cat => availableCategories.includes(cat.id));
  
  // Sort categories to put spicy at the end
  const visibleCategories = [
    ...filteredCategories.filter(cat => cat.id !== "spicy"),
    ...filteredCategories.filter(cat => cat.id === "spicy")
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-lg font-semibold">
            {t("gameSetup.selectCategory")}
          </label>
          <GameModeToggle />
        </div>
        <div className="flex items-center justify-between py-2">
          <label className="block text-sm font-medium text-gray-300">
            {t("gameSetup.randomCategory")}
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={game.randomCategory}
              onChange={(e) => setRandomCategory(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {visibleCategories.map((category, index) => {
            const isSpicy = category.id === "spicy";
            const isSelected = game.selectedCategory === category.id && !game.randomCategory;
            const isShaking = shakingCategory === category.id;
            const isLast = index === visibleCategories.length - 1;
            const isOdd = visibleCategories.length % 2 !== 0;
            const shouldSpanFull = isLast && isOdd;
            const isDisabled = game.randomCategory;

            const handleCategoryClick = () => {
              if (!isDisabled) {
                setCategory(category.id);
                if (isSpicy && !isSelected) {
                  setShakingCategory(category.id);
                  setTimeout(() => setShakingCategory(null), 600);
                }
              }
            };

            const customClass = isSpicy
              ? "btn-warning"
              : "";

            const shakeClass = isShaking ? "animate-spicy-shake" : "";
            const spanClass = shouldSpanFull ? "col-span-2" : "";

            return (
              <button
                key={category.id}
                onClick={handleCategoryClick}
                disabled={isDisabled}
                className={`${
                  isSelected
                    ? `btn-base btn-category-active ${customClass} ${shakeClass}`
                    : `btn-base btn-category-inactive`
                } ${spanClass} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {category.icon} {t(category.nameKey)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
