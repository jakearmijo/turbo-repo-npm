import {
  ActivityLevelOptionDescription,
  ActivityLevelOptionSubdescription,
} from "./onboardingOptionsEnums.js";

export interface ActivityLevelOption {
  id: number;
  description: string;
  subdescription?: string;
  subtext?: string;
}

export const ActivityLevelOptions: Array<ActivityLevelOption> = [
  {
    id: 1,
    description: ActivityLevelOptionDescription.MOSTLY_SEDENTARY,
    subdescription: ActivityLevelOptionSubdescription.MOSTLY_SEDENTARY,
  },
  {
    id: 2,
    description: ActivityLevelOptionDescription.MODERATELY_ACTIVE,
    subdescription: ActivityLevelOptionSubdescription.MODERATELY_ACTIVE,
  },
  {
    id: 3,
    description: ActivityLevelOptionDescription.VERY_ACTIVE,
    subdescription: ActivityLevelOptionSubdescription.VERY_ACTIVE,
  },
];
