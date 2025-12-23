import { useState } from "react";
import { useStore } from "@nanostores/react";
import { gameStore, setCategory } from "../../stores/gameStore";
import { useLanguage } from "../../hooks/useLanguage";
import { categories } from "./categories";
import { GameModeToggle } from "./GameModeToggle";

interface CategoryData {
	id: string;
	words: string[];
	words_en: string[] | null;
}

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
        <div className="grid grid-cols-2 gap-3">
          {visibleCategories.map((category, index) => {
            const isSpicy = category.id === "spicy";
            const isSelected = game.selectedCategory === category.id;
            const isShaking = shakingCategory === category.id;
            const isLast = index === visibleCategories.length - 1;
            const isOdd = visibleCategories.length % 2 !== 0;
            const shouldSpanFull = isLast && isOdd;

            const handleCategoryClick = () => {
              setCategory(category.id);
              if (isSpicy && !isSelected) {
                setShakingCategory(category.id);
                setTimeout(() => setShakingCategory(null), 600);
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
                className={`${
                  isSelected
                    ? `btn-base btn-category-active ${customClass} ${shakeClass}`
                    : `btn-base btn-category-inactive`
                } ${spanClass}`}
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
