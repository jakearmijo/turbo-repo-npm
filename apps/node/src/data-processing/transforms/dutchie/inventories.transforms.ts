
import * as floraTypes from "@repo/types";
const { LabResultsSchema } = floraTypes;

export const transformDutchieInventories = (
  inputArray: any,
  storeId: number,
) => {
  const transformedArray = inputArray.map((product: any) => {
    return {
      storeId: storeId,
      unitWeightUnit: product.unitWeightUnit || null,
      productId: product.productId || null,
      productName: product.productName,
      description: product.description || null,
      geneticaProductDescription: null,
      geneticaDescription: null,
      geneticaStrainDescription: null,
      category: product.category,
      imageUrl: product.imageUrl || null,
      quantityAvailable: product.quantityAvailable,
      unitWeight: product.unitWeight,
      batchId: product.batchId || null,
      batchName: product.batchName || null,
      packageId: product.packageId || null,
      unitPrice: product.unitPrice,
      medUnitPrice: product.medUnitPrice || null,
      recUnitPrice: product.recUnitPrice || null,
      pricingTierName: product.pricingTierName || null,
      strainId: product.strainId || null,
      strain: product.strain || null,
      strainType: product.strainType || null,
      labResults: product.labResults
        ? loopOverLabResults(product.labResults)
        : [],
      roomQuantities: product.roomQuantities ? product.roomQuantities : [],
      testedDate: product.testedDate || null,
      sampleDate: product.sampleDate || null,
      packagedDate: product.packagedDate || null,
      manufacturingDate: product.manufacturingDate || null,
      labTestStatus: product.labTestStatus || null,
      vendor: product.vendor || null,
      vendorId: product.vendorId || null,
      expirationDate: product.expirationDate || null,
      brandId: product.brandId || null,
      brandName: product.brandName || null,
      medicalOnly: product.medicalOnly || null,
      externalPackageId: product.externalPackageId || null,
      producer: product.producer || null,
      producerId: product.producerId || null,
      masterCategory: product.masterCategory,
      flavors: "",
      headspace: "",
      terpenes: "",
      thccontent: "",
      cbdcontent: "",
      cannabinoids: "",
      cannabinoidLevels: "",
      // tags: product.tags ? product.tags : [],
      createdBy: 1,
      updatedBy: 1,
    };
  });

  return transformedArray;
};

const loopOverLabResults = (labResults: typeof LabResultsSchema[]) => {
  const formattedLabResults = labResults.map((result: typeof LabResultsSchema) => ({
    labTest: result.parse("labTest") || "",
    value: result.parse("value") || 0,
    labResultUnit: result.parse("labResultUnit") || 0,
  }));
  return formattedLabResults;
};
