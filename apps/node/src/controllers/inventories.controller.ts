import { Request, Response } from "express";
import Inventories from "../models/inventories.model.js";
import logger from "../middleware/logger/index.js";

export const createInventory = async (req: Request, res: Response) => {
  if (!req.body.productId) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }
  try {
    const inventory = {
      productId: req.body.productId,
      storeId: req.body.storeId,
      measurementUnitId: req.body.measurementUnitId,
      batchId: req.body.batchId,
      quantityAvailable: req.body.quantityAvailable,
      unitPrice: req.body.unitPrice,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const newInventory = await Inventories.create(inventory);

    return res.status(200).json(newInventory);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllInventories = async (req: Request, res: Response) => {
  try {
    const allInventory = await Inventories.findAll();
    return res.status(200).json(allInventory);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneInventory = async (req: Request, res: Response) => {
  try {
    const retailinventory_id = +req.params.id;
    const inventory = await Inventories.findByPk(retailinventory_id);
    return res.status(200).json(inventory);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const retailinventory_id = +req.params.id;
    const rowsUpdated = await Inventories.update(req.body, {
      where: { id: retailinventory_id },
    });
    if (rowsUpdated) {
      const updatedInventory = await Inventories.findByPk(retailinventory_id);
      return res.status(200).json(updatedInventory);
    } else {
      return res.status(400).json({
        message: `Cannot update retail inventory with id=${retailinventory_id}. Maybe retail inventory was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteInventory = async (req: Request, res: Response) => {
  const retailinventory_id = +req.params.id;
  try {
    await Inventories.destroy({
      where: { id: retailinventory_id },
    });
    return res
      .status(200)
      .json(`Retail Inventory ${retailinventory_id} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllInventories = async (req: Request, res: Response) => {
  try {
    const deletedInventories = await Inventories.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(200)
      .json(`Deleted ${deletedInventories} Retail Inventories`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllStoreInventories = async (
  req: Request,
  res: Response,
) => {
  try {
    const storeId = req.query.storeId;
    const deletedInventories = await Inventories.destroy({
      where: { storeId: storeId },
      truncate: false,
    });
    return res
      .status(200)
      .json(`Deleted ${deletedInventories} Retail Inventories`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findSingleStoreInventory = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;

    const allSingleStoreInventory: Inventories[] = await Inventories.findAll({
      where: { storeId },
    });

    return res.status(200).json(allSingleStoreInventory);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getSingleStoreInventoryIds = async (
  req: Request,
  res: Response,
) => {
  try {
    const restailstore_id = req.params.storeId;

    const allSingleStoreInventoryIds = await Inventories.findAll({
      where: {
        storeId: restailstore_id,
      },
    });

    const result = allSingleStoreInventoryIds.map((item) => {
      return {
        [item.dataValues.productId]: {
          category: item.dataValues.category,
          qtyAvailable: item.dataValues.quantityAvailable,
          unitPrice: item.dataValues.unitPrice,
          masterCategory: item.dataValues.masterCategory,
        },
      };
    });

    return res.status(200).json(result);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
