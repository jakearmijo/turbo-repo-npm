import {
  generateStrainTypeCategoryId,
  generateStrainTypeCategoryName,
} from "../../../utils/common-functions.js";
import { v4 as uuidv4 } from "uuid";

export const transformDutchieStrains = (inputArray: any) => {
  const transformedArray = inputArray.map((strain: any) => {
    return {
      uuid: uuidv4(),
      strainName: strain.strainName,
      retailstraintype_id: generateStrainTypeCategoryId(strain.strainType),
      strainType: generateStrainTypeCategoryName(strain.strainType),
      strainDescription: strain.strainDescription,
      abbreviation: strain.strainAbbreviation,
      retailstrain_features: strain.retailstrain_features || null,
      createdBy: 1,
      updatedBy: 1,
    };
  });

  return transformedArray;
};
