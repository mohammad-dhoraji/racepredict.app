import { createTierItemImage } from "./tierImage";

export const teams = [
  {
    id: "mclaren",
    name: "McLaren",
    fullName: "McLaren Formula 1 Team",
    image: createTierItemImage("McLaren", "#ff8700", "#1a1a1a"),
    alt: "Graphic card for the McLaren Formula 1 Team"
  },
  {
    id: "ferrari",
    name: "Ferrari",
    fullName: "Scuderia Ferrari HP",
    image: createTierItemImage("Ferrari", "#dc0000", "#180808"),
    alt: "Graphic card for Scuderia Ferrari"
  },
  {
    id: "red_bull",
    name: "Red Bull",
    fullName: "Oracle Red Bull Racing",
    image: createTierItemImage("Red Bull", "#1e41ff", "#090d2a"),
    alt: "Graphic card for Oracle Red Bull Racing"
  },
  {
    id: "mercedes",
    name: "Mercedes",
    fullName: "Mercedes-AMG PETRONAS Formula One Team",
    image: createTierItemImage("Mercedes", "#00d2be", "#081414"),
    alt: "Graphic card for Mercedes-AMG PETRONAS Formula One Team"
  },
  {
    id: "aston_martin",
    name: "Aston Martin",
    fullName: "Aston Martin Aramco Formula One Team",
    image: createTierItemImage("Aston Martin", "#006f62", "#071513"),
    alt: "Graphic card for Aston Martin Aramco Formula One Team"
  },
  {
    id: "alpine",
    name: "Alpine",
    fullName: "BWT Alpine Formula One Team",
    image: createTierItemImage("Alpine", "#ff5ab9", "#120815"),
    alt: "Graphic card for BWT Alpine Formula One Team"
  },
  {
    id: "williams",
    name: "Williams",
    fullName: "Williams Racing",
    image: createTierItemImage("Williams", "#1868db", "#08101d"),
    alt: "Graphic card for Williams Racing"
  },
  {
    id: "rb",
    name: "Racing Bulls",
    fullName: "Visa Cash App Racing Bulls Formula One Team",
    image: createTierItemImage("Racing Bulls", "#5d8df8", "#0b1020"),
    alt: "Graphic card for Visa Cash App Racing Bulls Formula One Team"
  },
  {
    id: "sauber",
    name: "Sauber",
    fullName: "Stake F1 Team Kick Sauber",
    image: createTierItemImage("Sauber", "#52e252", "#081708"),
    alt: "Graphic card for Stake F1 Team Kick Sauber"
  },
  {
    id: "haas",
    name: "Haas",
    fullName: "MoneyGram Haas F1 Team",
    image: createTierItemImage("Haas", "#d0d0d0", "#111111"),
    alt: "Graphic card for MoneyGram Haas F1 Team"
  }
];
