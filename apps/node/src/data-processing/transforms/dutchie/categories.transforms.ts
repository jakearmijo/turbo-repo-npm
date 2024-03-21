export const transformDutchieCategories = (inputArray: any) => {
  const transformedArray = inputArray.map((category: any) => {
    return {
      categoryId: category.productCategoryId,
      name: category.productCategoryName.toLowerCase(),
      description: null,
      parentId: null,
      parentName: category.masterCategory.toLowerCase(),
      createdBy: 1,
      updatedBy: 1,
    };
  });

  return transformedArray;
};
