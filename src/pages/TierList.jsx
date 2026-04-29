import { useState, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove
} from "@dnd-kit/sortable";
import { Skeleton } from "boneyard-js/react";
import { useNavigate } from "react-router-dom";
import TierToolbar from "../components/tierlist/TierToolbar";
import BottomNav from "../components/tierlist/BottomNav";
import TierContainer from "../components/tierlist/TierContainer";
import UnrankedPool from "../components/tierlist/UnrankedPool";
import { DriverCardOverlay } from "../components/tierlist/DriverCard";
import Modal from "../components/Modal";
import TierListExportModal from "../components/tierlist/TierListExportModal";
import TierListExportView from "../components/tierlist/TierListExportView";
import { exportTierList } from "../hooks/useTierListExport";
import {
  CATEGORY_NAV_ITEMS,
  DEFAULT_ACTIVE_CATEGORY,
  getTierCategory
} from "../data/tierCategories";
import { createEmptyTiers, TIER_LABELS } from "../data/tierConfig";

const UNRANKED_POOL_ID = "unranked-pool";
const TIER_ENTRIES = Object.entries(TIER_LABELS);
const TIER_KEYS = Object.keys(TIER_LABELS);

export default function TierListPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(DEFAULT_ACTIVE_CATEGORY);
  const [tiers, setTiers] = useState(() => createEmptyTiers());
  const [unrankedIds, setUnrankedIds] = useState(() =>
    getTierCategory(DEFAULT_ACTIVE_CATEGORY).items.map((item) => item.id)
  );
  const [activeId, setActiveId] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const exportRef = useRef();

  const activeCategoryData = useMemo(
    () => getTierCategory(activeCategory),
    [activeCategory]
  );
  const itemIds = useMemo(
    () => activeCategoryData.items.map((item) => item.id),
    [activeCategoryData]
  );
  const itemsById = useMemo(
    () => Object.fromEntries(activeCategoryData.items.map((item) => [item.id, item])),
    [activeCategoryData]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const unrankedIdSet = useMemo(
    () => new Set(unrankedIds),
    [unrankedIds]
  );

  const handleCategoryChange = useCallback((nextCategory) => {
    if (nextCategory === activeCategory) {
      return;
    }

    setIsCategoryVisible(false);
    setActiveCategory(nextCategory);
    setTiers(createEmptyTiers());
    setUnrankedIds(getTierCategory(nextCategory).items.map((item) => item.id));
    setActiveId(null);

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        setIsCategoryVisible(true);
      }, 0);
    } else {
      setIsCategoryVisible(true);
    }
  }, [activeCategory]);

  const findContainer = useCallback(
    (itemId) => {
      const id = itemId.toString();

      if (id === UNRANKED_POOL_ID) return UNRANKED_POOL_ID;
      if (id.startsWith("tier-")) return id.replace("tier-", "");
      if (TIER_KEYS.includes(id)) return id;

      for (const tier of TIER_KEYS) {
        if (tiers[tier].includes(id)) return tier;
      }

      if (unrankedIdSet.has(id)) return UNRANKED_POOL_ID;

      return null;
    },
    [tiers, unrankedIdSet]
  );

  const customCollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    return closestCorners(args);
  }, []);

  const activeItem = activeId ? itemsById[activeId] : null;

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const itemId = active.id.toString();

    if (overContainer === UNRANKED_POOL_ID) {
      if (activeContainer !== UNRANKED_POOL_ID) {
        setTiers((prev) => ({
          ...prev,
          [activeContainer]: prev[activeContainer].filter((id) => id !== itemId)
        }));
        setUnrankedIds((prev) =>
          prev.includes(itemId) ? prev : [...prev, itemId]
        );
      }
    } else if (overContainer in TIER_LABELS) {
      const overItems = tiers[overContainer];
      const overIndex = overItems.indexOf(over.id.toString());
      const insertIndex = overIndex >= 0 ? overIndex : overItems.length;

      setTiers((prev) => {
        const next = { ...prev };

        if (activeContainer !== UNRANKED_POOL_ID && activeContainer in TIER_LABELS) {
          next[activeContainer] = prev[activeContainer].filter((id) => id !== itemId);
        }

        const targetArr = next[overContainer].filter((id) => id !== itemId);
        targetArr.splice(insertIndex, 0, itemId);
        next[overContainer] = targetArr;

        return next;
      });

      if (activeContainer === UNRANKED_POOL_ID) {
        setUnrankedIds((prev) => prev.filter((id) => id !== itemId));
      }
    }
  }, [findContainer, tiers]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const itemId = active.id.toString();
    const overId = over.id.toString();

    const activeContainer = findContainer(itemId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      if (activeContainer === UNRANKED_POOL_ID) {
        setUnrankedIds((prev) => {
          const oldIndex = prev.indexOf(itemId);
          const newIndex = prev.indexOf(overId);
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      } else if (activeContainer in TIER_LABELS) {
        setTiers((prev) => {
          const items = prev[activeContainer];
          const oldIndex = items.indexOf(itemId);
          const newIndex = items.indexOf(overId);
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
          return {
            ...prev,
            [activeContainer]: arrayMove(items, oldIndex, newIndex)
          };
        });
      }
      return;
    }

    if (overContainer === UNRANKED_POOL_ID) {
      if (activeContainer !== UNRANKED_POOL_ID) {
        setTiers((prev) => ({
          ...prev,
          [activeContainer]: prev[activeContainer].filter((id) => id !== itemId)
        }));
        setUnrankedIds((prev) =>
          prev.includes(itemId) ? prev : [...prev, itemId]
        );
      }
    } else if (overContainer in TIER_LABELS) {
      setTiers((prev) => {
        const next = { ...prev };

        if (activeContainer !== UNRANKED_POOL_ID && activeContainer in TIER_LABELS) {
          next[activeContainer] = prev[activeContainer].filter((id) => id !== itemId);
        }

        if (!next[overContainer].includes(itemId)) {
          const overIndex = next[overContainer].indexOf(overId);
          const insertIndex = overIndex >= 0 ? overIndex : next[overContainer].length;
          const targetArr = [...next[overContainer]];
          targetArr.splice(insertIndex, 0, itemId);
          next[overContainer] = targetArr;
        }

        return next;
      });

      if (activeContainer === UNRANKED_POOL_ID) {
        setUnrankedIds((prev) => prev.filter((id) => id !== itemId));
      }
    }
  }, [findContainer]);

  const handleReset = useCallback(() => {
    setShowResetModal(true);
  }, []);

  const confirmReset = useCallback(() => {
    setTiers(createEmptyTiers());
    setUnrankedIds(itemIds);
    setActiveId(null);
    setShowResetModal(false);
  }, [itemIds]);

  const handleExport = useCallback(() => exportTierList(exportRef), []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <TierToolbar
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        navItems={CATEGORY_NAV_ITEMS}
        onHomeClick={() => navigate("/")}
        onReset={handleReset}
        onExport={() => setShowExportModal(true)}
      />
      <BottomNav
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        navItems={CATEGORY_NAV_ITEMS}
      />

      <main className="pt-20 pb-24 px-2 sm:px-6 max-w-7xl mx-auto min-h-screen">
        <Skeleton
          name="tier-list-header"
          loading={false}
          className="mb-4 sm:mb-8"
        >
          <section className="mb-4 sm:mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-2 font-f1">
              Construct {activeCategoryData.label}
            </h1>
            {/* <p className="text-on-surface/40 text-xs sm:text-base md:text-lg font-light tracking-wide font-mono max-w-xl">
              Switch categories from the navigation and rank the current pool without reloading the page.
            </p> */}
          </section>
        </Skeleton>

        <div
          className={`transition-opacity duration-200 ease-out ${
            isCategoryVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Skeleton
            name="tier-list-content"
            loading={false}
            className="mb-4"
          >
            <div className="flex flex-col rounded-xl bg-[#1c1c1c]/50 p-1 sm:p-2 border border-surface-dim/20 mb-4 gap-1 sm:gap-2 min-h-[360px]">
              {TIER_ENTRIES.map(([tier, { color }]) => (
                <TierContainer
                  key={`${activeCategory}-${tier}`}
                  tier={tier}
                  itemIds={tiers[tier]}
                  itemsById={itemsById}
                  label={tier}
                  color={color}
                />
              ))}
            </div>
          </Skeleton>

          <Skeleton
            name="tier-list-pool"
            loading={false}
          >
            <div className="min-h-[160px]">
              <UnrankedPool
                itemIds={unrankedIds}
                itemsById={itemsById}
                title="Unassigned Pool"
                categoryPlural={activeCategoryData.plural}
              />
            </div>
          </Skeleton>
        </div>
      </main>

      {typeof document !== "undefined"
        ? createPortal(
            <DragOverlay zIndex={10000}>
              {activeItem ? <DriverCardOverlay item={activeItem} /> : null}
            </DragOverlay>,
            document.body
          )
        : null}

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        type="error"
        title="Reset all tiers?"
        message={`All ${activeCategoryData.plural} will be moved back to the unassigned pool. This cannot be undone.`}
        confirmLabel="Reset"
        onConfirm={confirmReset}
      />

      <TierListExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        tiers={tiers}
        itemsById={itemsById}
        categoryLabel={activeCategoryData.exportLabel}
        onExport={handleExport}
      />

      <TierListExportView
        ref={exportRef}
        tiers={tiers}
        itemsById={itemsById}
        categoryLabel={activeCategoryData.exportLabel}
      />
    </DndContext>
  );
}
