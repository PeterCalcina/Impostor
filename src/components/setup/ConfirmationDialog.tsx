import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-6 max-w-md w-full space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-red-500">
              {t("gameSetup.spicyWarning.title")}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400! hover:text-white! transition-colors btn-icon"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-gray-300 text-lg">
            {t("gameSetup.spicyWarning.message")}
          </p>
          <p className="text-gray-400 text-sm">
            {t("gameSetup.spicyWarning.description")}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary-md"
          >
            {t("gameSetup.spicyWarning.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-warning"
          >
            {t("gameSetup.spicyWarning.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
