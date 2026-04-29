import { circuits } from "./circuits";
import { drivers } from "./drivers";
import { teams } from "./teams";

export const DEFAULT_ACTIVE_CATEGORY = "drivers";

export const CATEGORY_NAV_ITEMS = [
  {
    key: "drivers",
    label: "Drivers",
    singular: "driver",
    plural: "drivers",
    exportLabel: "Driver"
  },
  {
    key: "teams",
    label: "Teams",
    singular: "team",
    plural: "teams",
    exportLabel: "Team"
  },
  {
    key: "circuits",
    label: "Circuits",
    singular: "circuit",
    plural: "circuits",
    exportLabel: "Circuit"
  }
];

const categoryItems = {
  drivers,
  teams,
  circuits
};

export const TIER_CATEGORY_MAP = Object.fromEntries(
  CATEGORY_NAV_ITEMS.map((category) => [
    category.key,
    {
      ...category,
      items: categoryItems[category.key]
    }
  ])
);

export function getTierCategory(key) {
  return TIER_CATEGORY_MAP[key] ?? TIER_CATEGORY_MAP[DEFAULT_ACTIVE_CATEGORY];
}
