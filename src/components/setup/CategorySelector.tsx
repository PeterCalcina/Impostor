import { useState } from "react";
import { useStore } from "@nanostores/react";
import { gameStore, setCategory } from "../../stores/gameStore";
import { useLanguage } from "../../hooks/useLanguage";
import { categories } from "./categories";

export function CategorySelector() {
  const game = useStore(gameStore);
  const { t } = useLanguage();
  const [shakingCategory, setShakingCategory] = useState<string | null>(null);

  return (
    <>
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
              ? "bg-red-700! hover:bg-red-500! border-red-500! shadow-red-500/50!"
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
    </>
  );
}
