import { DietOptionDescription } from "./onboardingOptionsEnums.js";
export interface DietOption {
  id: number;
  description: string;
  // icon: string;
}

export const DietOptions: Array<DietOption> = [
  {
    id: 1,
    description: DietOptionDescription.STANDARD,
    // icon: Burger,
  },
  {
    id: 2,
    description: DietOptionDescription.VEGETARIAN_VEGAN,
    // icon: FruitAndVeg,
  },
  {
    id: 3,
    description: DietOptionDescription.PALEO,
    // icon: Tomato,
  },
  {
    id: 4,
    description: DietOptionDescription.KETOGENIC_LOW_CARB,
    // icon: Tomato,
  },
  {
    id: 6,
    description: DietOptionDescription.INTERMITTENT_FASTING,
    // icon: NoUtensils,
  },
  {
    id: 7,
    description: DietOptionDescription.CARNIVORE,
    // icon: Tomato,
  },
  {
    id: 8,
    description: DietOptionDescription.PESCATARIAN,
    // icon: Tomato,
  },
  {
    id: 5,
    description: DietOptionDescription.PREFER_NOT_TO_SAY,
    // icon: Tomato,
  },
];
