import { Request, Response } from "express";
import ProductCatalogs from "../models/productCatalogs.model.js";
import logger from "../middleware/logger/index.js";

export const createProductCatalog = async (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(400).json({
      message: "Content can not be empty!",
    });
    return;
  }
  try {
    const productCatalog = {
      brandId: req.body.brandId,
      categoryId: req.body.categoryId,
      strainId: req.body.strainId,
      measurementUnitId: req.body.measurementUnitId,
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const newProductCatalog = await ProductCatalogs.create(productCatalog);

    return res.status(200).json(newProductCatalog);
  } catch (error: any) {
    logger.error(
      "🚀 ~ file: productCatalogs.controller.ts:31 ~ createProductCatalog ~ error:",
      error,
    );
    return res.status(500).json({ message: error.message });
  }
};

export const createProductCatalogBulk = async (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    await ProductCatalogs.bulkCreate(req.body, { validate: true });
    return res
      .status(200)
      .json({ message: "All Retail Product Catalog Items Were Created" });
  }
  return res.status(400).json({ message: "req.body is NOT an array" });
};

export const findAllProductCatalogs = async (req: Request, res: Response) => {
  const name = req.query.name;
  const allProductCatalogs = await ProductCatalogs.findAll({
    where: { name: name },
  });
  return res.status(200).json(allProductCatalogs);
};

export const findOneProductCatalog = async (req: Request, res: Response) => {
  const productId = +req.params.id;
  const productCatalog = await ProductCatalogs.findByPk(productId);
  return res.status(200).json(productCatalog);
};

export const updateProductCatalog = async (req: Request, res: Response) => {
  const productId = +req.params.id;
  const rowsUpdated = await ProductCatalogs.update(req.body, {
    where: { productId: productId },
  });
  if (rowsUpdated) {
    const updatedProductCatalog = await ProductCatalogs.findByPk(productId);
    res.status(200).json(updatedProductCatalog);
  } else {
    res.status(400).json({
      message: `Cannot update retail product catalog with id=${productId}. Maybe retail product catalog was not found or req.body is empty!`,
    });
  }
};

export const deleteProductCatalog = async (req: Request, res: Response) => {
  const productId = +req.params.id;
  await ProductCatalogs.destroy({
    where: { productId: productId },
  });
  return res.status(200).json(`Retail Product Catalog ${productId} Deleted`);
};

export const deleteAllProductCatalogs = async (req: Request, res: Response) => {
  const deletedProductCatalogs = await ProductCatalogs.destroy({
    where: {},
    truncate: false,
  });
  return res
    .status(200)
    .json(`Deleted ${deletedProductCatalogs} Retail Product Catalogs`);
};
