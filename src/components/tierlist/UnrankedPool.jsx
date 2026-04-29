import { memo, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import DriverCard from "./DriverCard";

function UnrankedPool({ itemIds, itemsById, title, categoryPlural }) {
  const { setNodeRef } = useDroppable({
    id: "unranked-pool"
  });
  const items = useMemo(
    () => itemIds.map(id => itemsById[id]).filter(Boolean),
    [itemIds, itemsById]
  );
  const unrankedCount = itemIds.length;
  const isEmpty = unrankedCount === 0;

  return (
    <section className="mt-4 sm:mt-6 mb-2 border-t border-surface-dim/20 pt-4 sm:pt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-f1 text-xs tracking-[0.2em] uppercase text-on-surface/40">
          {title}
        </h3>
        <span className="text-on-surface/20 font-mono text-[10px]">
          {unrankedCount} {categoryPlural.toUpperCase()} REMAINING
        </span>
      </div>

      {isEmpty ? (
        <div
          ref={setNodeRef}
          className="rounded-lg ring-1 ring-inset ring-on-surface/10 text-on-surface/30 font-mono text-xs text-center py-6 sm:py-12"
        >
          All {categoryPlural} have been ranked
        </div>
      ) : (
        <div
          ref={setNodeRef}
          className="flex flex-wrap gap-1.5 sm:gap-2 pb-1 sm:pb-2 min-h-[70px] sm:min-h-24"
        >
          <SortableContext
            items={itemIds}
            strategy={rectSortingStrategy}
          >
            {items.map(item => (
              <DriverCard key={item.id} item={item} />
            ))}
          </SortableContext>
        </div>
      )}
    </section>
  );
}

export default memo(UnrankedPool);
