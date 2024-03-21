import { Request, Response } from "express";
import Categories from "../models/categories.model.js";
import logger from "../middleware/logger/index.js";
import * as floraTypes from "@repo/types";
const { CategorySchema } = floraTypes;

export const createCategory = async (req: Request, res: Response) => {
  try {
    if (Array.isArray(req.body)) {
      await Categories.bulkCreate(req.body, { validate: true });
      return res
        .status(200)
        .json({ message: "All Retail Product Categories Were Created" });
    }

    if (!req.body.name) {
      return res.status(400).json({
        message: "Category 'name' can not be empty!",
      });
    }
    const categoryInput = CategorySchema.safeParse(req.body);
    if (!categoryInput.success) {
      logger.error(
        "categoryInput.error - CategorySchema.safeParse",
        categoryInput,
      );
      return res.status(400).json({ message: categoryInput });
    }
    const newRetailCategory = await Categories.create(categoryInput);
    return res.status(200).json(newRetailCategory);
  } catch (error: any) {
    logger.error(
      "🚀 ~ file: categories.controller.ts:36 ~ createCategory ~ error:",
      error,
    );
    return res.status(500).json({ message: error.message });
  }
};

export const findAllCategories = async (req: Request, res: Response) => {
  try {
    const allRetailCategories = await Categories.findAll();
    return res.status(200).json(allRetailCategories);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const findOneCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = +req.params.id;
    const retailCategory = await Categories.findByPk(categoryId);
    return res.status(200).json(retailCategory);
  } catch (error: any) {
    logger.error("findOneCategory ~ error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = +req.params.id;
    const categoryInput = CategorySchema.safeParse(req.body);
    if (!categoryInput.success) {
      if (!categoryInput.success) {
        logger.error("updateCategory - categoryInput.error: ", categoryInput);
        return res.status(400).json({ message: categoryInput });
      }
    }
    const rowsUpdated = await Categories.update(req.body, {
      where: { id: categoryId },
    });
    if (rowsUpdated) {
      const updatedRetailCategory = await Categories.findByPk(categoryId);
      return res.status(200).json(updatedRetailCategory);
    } else {
      return res.status(400).json({
        message: `Cannot update retail category with id=${categoryId}. Maybe retail category was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = +req.params.id;
    await Categories.destroy({
      where: { id: categoryId },
    });
    return res.status(200).json(`Retail Category ${categoryId} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllCategories = async (req: Request, res: Response) => {
  try {
    const deletedRetailCategories = await Categories.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(200)
      .json(`Deleted ${deletedRetailCategories} Retail Categories`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
