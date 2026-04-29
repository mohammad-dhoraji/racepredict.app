import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Download, Instagram, Loader2 } from "lucide-react";
import TierListExportView from "./TierListExportView";

const TierListExportModal = ({
  isOpen,
  onClose,
  tiers,
  itemsById,
  categoryLabel,
  onExport
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const dataUrl = await onExport();
      if (!dataUrl) {
        alert("Failed to generate image. Please try again.");
        return;
      }

      const link = document.createElement("a");
      link.download = "gridlock-tier-list.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, onExport]);

  const handleInstagramShare = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const dataUrl = await onExport();
      if (!dataUrl) {
        alert("Failed to generate image. Please try again.");
        return;
      }

      // Convert data URL to blob for sharing
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "gridlock-tier-list.png", {
        type: "image/png",
      });

      // Try native share with file
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: `My F1 ${categoryLabel} Tier List`,
            text: `Check out my F1 ${categoryLabel.toLowerCase()} rankings on Gridlock.`,
            files: [file],
          });
          return;
        } catch (shareErr) {
          // User cancelled or share failed, fallback to download
          console.log("Native share failed, falling back to download", shareErr);
        }
      }

      // Fallback: download the image
      const link = document.createElement("a");
      link.download = "gridlock-tier-list.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setIsGenerating(false);
    }
  }, [categoryLabel, isGenerating, onExport]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg transition-all duration-200">
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <div className="mb-6">
            <h2
              id="export-modal-title"
              className="text-xl font-bold tracking-tight font-f1"
            >

              Export Tier List
            </h2>
            <p className="text-zinc-400 text-sm mt-1 font-mono">

              Preview and share your rankings
            </p>
          </div>

          {/* Preview */}
          <div className="mb-6 flex justify-center">
            <div
              className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-lg"
              style={{
                width: "270px",
                height: "350px",
              }}
            >
              <div
                style={{
                  transform: "scale(0.25)",
                  transformOrigin: "top left",
                  width: "1080px",
                  height: "1400px",
                }}
              >
                <TierListExportView
                  preview
                  tiers={tiers}
                  itemsById={itemsById}
                  categoryLabel={categoryLabel}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide font-f1 border transition active:scale-[0.98] flex items-center justify-center gap-2 bg-[#ff3b30]/15 border-[#ff3b30]/30 text-[#ff3b30] hover:bg-[#ff3b30]/25 disabled:opacity-50 disabled:cursor-not-allowed"

            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download PNG
                </>
              )}
            </button>

            <button
              onClick={handleInstagramShare}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide font-f1 border transition active:scale-[0.98] flex items-center justify-center gap-2 bg-zinc-800/60 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"

            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Instagram size={16} />
                  Share to Instagram
                </>
              )}
            </button>
          </div>

          {/* <p className="text-zinc-500 text-xs text-center mt-4">
            Optimized for Instagram Stories (9:16)
          </p> */}
        </div>
      </div>

    </div>,
    document.body
  );
};

export default TierListExportModal;
