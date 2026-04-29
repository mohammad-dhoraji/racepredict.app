import { memo, useMemo } from "react";
import {
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import DriverCard from "./DriverCard";

function TierContainer({ tier, itemIds, itemsById, label, color }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `tier-${tier}`
  });

  const items = useMemo(
    () => itemIds.map(id => itemsById[id]).filter(Boolean),
    [itemIds, itemsById]
  );
  const isEmpty = itemIds.length === 0;

  return (
    <div className="flex items-stretch group border border-surface-dim/20 rounded-lg">
      <div
        className={`w-10 sm:w-16 md:w-20 shrink-0 flex items-center justify-center font-f1 text-lg sm:text-xl tracking-widest text-on-surface bg-surface-container-low border-r border-surface-dim/20 sticky left-0 z-10 ${color}`}
      >
        {label}
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 bg-surface-container-low p-1.5 sm:p-2 flex flex-wrap gap-1.5 sm:gap-2 items-start content-start min-h-[60px] sm:min-h-[72px] transition-all duration-300 ${
          isOver ? "bg-[#2a2a2a] ring-1 ring-inset ring-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" : ""
        } ${isEmpty ? "ring-1 ring-inset ring-on-surface/5" : ""}`}
      >
        <SortableContext
          items={itemIds}
          strategy={rectSortingStrategy}
        >
          {items.map(item => (
            <DriverCard key={item.id} item={item} />
          ))}
        </SortableContext>

        {isEmpty && (
          <div className="text-white/30 font-mono text-xs uppercase tracking-tighter w-full h-full flex items-center justify-center">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TierContainer);
