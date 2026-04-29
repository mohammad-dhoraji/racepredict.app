export const TIER_LABELS = {
  S: { label: "S", color: "text-red-500" },
  A: { label: "A", color: "text-orange-500" },
  B: { label: "B", color: "text-yellow-500" },
  C: { label: "C", color: "text-green-500" },
  D: { label: "D", color: "text-blue-500" }
};

export const createEmptyTiers = () =>
  Object.fromEntries(Object.keys(TIER_LABELS).map((tier) => [tier, []]));
