import { memo, useMemo, forwardRef } from "react";
import { TIER_LABELS } from "../../data/tierConfig";
import Logo from "../../assets/logo.svg";

const TIER_COLORS = {
  S: "#ff4d4d",
  A: "#ff944d",
  B: "#ffd24d",
  C: "#4dff88",
  D: "#4da6ff",
  F: "#b84dff",
};

const EXPORT_WIDTH = 1080;

const EXPORT_HEIGHT = 1400;

const ExportDriverCard = memo(function ExportDriverCard({ item }) {
  return (
    <div className="flex-shrink-0 w-24 rounded-xl bg-[#1a1a1a] p-1">
      <div className="aspect-square overflow-hidden rounded-lg bg-[#111]">
        <img
          alt={item.fullName}
          src={item.image}
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
});

function ExportTierRow({ itemIds, itemsById, label, color }) {
  const items = useMemo(
    () => itemIds.map((id) => itemsById[id]).filter(Boolean),
    [itemIds, itemsById],
  );

  return (
    <div className="flex rounded-xl overflow-hidden border border-white/5 ">
      {/* Label */}
      <div
        className="w-24 flex items-center justify-center bg-[#111] text-2xl font-f1 font-bold"
        style={{ color: color || "#ffffff" }}
      >
        {label}
      </div>

      {/* Items */}
      <div className="flex-1 flex flex-wrap gap-2 p-3 bg-[#0d0d0d] min-h-[130px]">
        {items.map((item) => (
          <ExportDriverCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

const MemoRow = memo(ExportTierRow);

const TierListExportView = forwardRef(function TierListExportView(
  { tiers, itemsById, categoryLabel, preview = false },
  ref,
) {
  const tierEntries = useMemo(() => Object.entries(TIER_LABELS), []);

  const containerStyle = preview
    ? {
        width: `${EXPORT_WIDTH}px`,
        height: `${EXPORT_HEIGHT}px`,
        background: "#0a0a0a",
      }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        width: `${EXPORT_WIDTH}px`,
        height: `${EXPORT_HEIGHT}px`,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
        background: "#0a0a0a",
      };

  return (
    <div ref={ref} style={containerStyle}>
      <div className="w-full h-full flex flex-col px-8 py-12 text-white font-f1">
        {/* Header */}
        <div className="mb-10">
          <img src={Logo} alt="Gridlock Logo" />
          <p className="mt-4 text-white/55 tracking-[0.3em] uppercase text-xl font-f1">
            {categoryLabel} Tier List
          </p>
        </div>

        {/* Tiers */}
        <div className="flex flex-col gap-3 flex-1 justify-start">
          {tierEntries.map(([tier]) => (
            <MemoRow
              key={tier}
              label={tier}
              color={TIER_COLORS[tier]}
              itemIds={tiers[tier] || []}
              itemsById={itemsById}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-white/30 tracking-widest mt-3 uppercase text-4xl font-f1">
            Made on Gridlock
          </p>
        </div>
      </div>
    </div>
  );
});

export default TierListExportView;
