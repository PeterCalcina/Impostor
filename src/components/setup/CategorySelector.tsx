import { useState } from "react";
import { useStore } from "@nanostores/react";
import { gameStore, setCategory, setRandomCategory, setImpostorHintsEnabled } from "../../stores/gameStore";
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
    <div className="space-y-4 sm:space-y-6">
      {/* Game Settings Card - Both toggles together */}
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-4">
        <GameModeToggle showLabel={true} />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {t("gameSetup.randomCategory")}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Automatically select a category
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={game.randomCategory}
              onChange={(e) => setRandomCategory(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {t("gameSetup.impostorHints")}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {t("gameSetup.impostorHintsDescription")}
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={game.impostorHintsEnabled}
              onChange={(e) => setImpostorHintsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {t("gameSetup.selectCategory")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {visibleCategories.map((category, index) => {
            const isSpicy = category.id === "spicy";
            const isSelected = game.selectedCategory === category.id && !game.randomCategory;
            const isShaking = shakingCategory === category.id;
            const isLast = index === visibleCategories.length - 1;
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
            // Span logic: for 2 cols span-2 if odd, for 3 cols span-2 if remainder is 1
            const isOdd = visibleCategories.length % 2 !== 0;
            const remainder3 = visibleCategories.length % 3;
            const shouldSpan2Cols = isLast && isOdd; // For 2-column layout
            const shouldSpan2Cols3 = isLast && remainder3 === 1; // For 3-column layout
            const spanClass = shouldSpan2Cols ? "col-span-2 md:col-span-1" : shouldSpan2Cols3 ? "md:col-span-3" : "";

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
    </div>
  );
}
