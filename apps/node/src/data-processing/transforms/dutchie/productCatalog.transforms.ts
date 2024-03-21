export const transformDutchieProductCatalogs = (
  inputArray: any,
  storeId: number,
) => {
  const transformedArray = inputArray.map((product: any) => {
    return {
      name: product.name,
      description: product.description || null,
      geneticaProductDescription: null,
      geneticaStrainDescription: null,
      storeProductId: product.productId,
      categoryName: product.category,
      imageUrl: product.imageUrl || null,
      strainId: product.strainId || null,
      strainName: product.strain || null,
      strainType: product.strainType || null,
      brandId: product.brandId || null,
      brandName: product.brandId || null,
      vendorId: product.vendorId || null,
      vendorName: product.vendorName || null,
      thcContent: product.thcContent || null,
      cbdContent: product.cbdContent || null,
      price: product.price || null,
      flavors: product.flavor || null,
      lineageName: product.lineageName || null,
      dosage: product.dosage || null,
      allergens: product.allergens || null,
      regulatoryCategory: product.regulatoryCategory || null,
      ingredientList: product.ingredientList || null,
      measurementUnitId: product.netWeightUnit || null,
      parentName: product.masterCategory.toLowerCase(),
      storeId: storeId,

      createdBy: 1,
      updatedBy: 1,
    };
  });

  return transformedArray;
};
