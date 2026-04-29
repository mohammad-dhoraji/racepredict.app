import { memo, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CARD_BASE_CLASSNAME =
  "flex-shrink-0 w-14 sm:w-16 md:w-20 rounded-lg border p-1 touch-none";
const CARD_IDLE_CLASSNAME =
  "group/card cursor-grab active:cursor-grabbing bg-[#1c1c1c] border-transparent transition-all duration-300 hover:bg-surface-container-high hover:border-on-surface/10";
const CARD_DRAG_CLASSNAME =
  "cursor-grabbing bg-[#2a2a2a] border-transparent shadow-[0_10px_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20 transition-none scale-110 z-50";
const IMAGE_IDLE_CLASSNAME =
  "h-full w-full object-cover transition-all duration-500 group-hover/card:brightness-110 group-hover/card:scale-105";
const IMAGE_DRAG_CLASSNAME =
  "h-full w-full object-cover brightness-110 transition-none";

const DriverCardVisual = memo(function DriverCardVisual({ item, dragging = false }) {
  return (
    <div
      className={`${CARD_BASE_CLASSNAME} ${
        dragging ? CARD_DRAG_CLASSNAME : CARD_IDLE_CLASSNAME
      }`}
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-surface-dim">
        <img
          alt={item.fullName}
          className={dragging ? IMAGE_DRAG_CLASSNAME : IMAGE_IDLE_CLASSNAME}
          src={item.image}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
});

function DriverCard({ item }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id });

  const style = useMemo(
    () => ({
      opacity: isDragging ? 0.3 : 1,
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? undefined : transition
    }),
    [isDragging, transform, transition]
  );

  return (
    <div
      ref={setNodeRef}
      className="transform-gpu will-change-transform"
      style={style}
      {...attributes}
      {...listeners}
    >
      <DriverCardVisual item={item} dragging={isDragging} />
    </div>
  );
}

const MemoizedDriverCard = memo(DriverCard);

export const DriverCardOverlay = memo(function DriverCardOverlay({ item }) {
  return (
    <div className="pointer-events-none transform-gpu will-change-transform">
      <DriverCardVisual item={item} dragging />
    </div>
  );
});

export default MemoizedDriverCard;
