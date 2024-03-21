import { Request, Response } from "express";
import Strains from "../models/strains.model.js";
import floraSequelize from "../sequelize.js";
import { generateStrainTypeCategoryId } from "../utils/common-functions.js";
import sequelize from "sequelize";
import logger from "../middleware/logger/index.js";

export const createStrain = async (req: Request, res: Response) => {
  try {
    if (Array.isArray(req.body)) {
      await Strains.bulkCreate(req.body, { validate: true });
      return res.status(200).json({ message: "All Strains were created" });
    }
  } catch (error) {
    logger.error(
      "🚀 ~ file: retailstrains.controller.js:14 ~ createStrain ~ error:",
      error,
    );
  }

  if (!req.body.strainName) {
    res.status(400).json({
      message: "Content can not be empty!",
    });
    return;
  }
  try {
    const strain = {
      storeId: req.body.storeId,
      strainName: req.body.strainName,
      retailstore_strain_id: req.body.strainId,
      strainDescription: req.body.strainDescription,
      abbreviation: req.body.strainAbbreviation,
      strainType: req.body.strainType.toLowerCase(),
      retailstraintype_id: generateStrainTypeCategoryId(req.body.strainType),
      retailstrain_features: req.body.retailstrain_features || "",
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const newStrain = await Strains.create({
      ...strain,
      retailstrain_features: sequelize.fn(
        "array_append",
        sequelize.col("retailstrain_features"),
        req.body.retailstrain_features,
      ),
    });

    return res.status(200).json(newStrain);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllStrains = async (req: Request, res: Response) => {
  try {
    const allStrains = await Strains.findAll();
    return res.status(200).json(allStrains);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneStrain = async (req: Request, res: Response) => {
  try {
    const strainId = +req.params.id;
    const strain = await Strains.findByPk(strainId);
    return res.status(200).json(strain);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const bulkUpdateStrain = async (req: Request, res: Response) => {
  const updateStrainsArray = req.body;
  if (!updateStrainsArray || !Array.isArray(updateStrainsArray)) {
    return res.status(400).json({ message: "Invalid data format" });
  }
  const transaction = await (await floraSequelize).transaction();
  try {
    for (const strain of updateStrainsArray) {
      const { strainId } = strain;
      await Strains.update(strain, {
        where: { strainId: strainId },
        transaction,
      });
    }

    await transaction.commit();
    return res
      .status(200)
      .json({ message: "Bulk update completed successfully" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStrain = async (req: Request, res: Response) => {
  try {
    const strainId = +req.params.id;
    const rowsUpdated = await Strains.update(req.body, {
      where: { strainId: strainId },
    });
    if (rowsUpdated) {
      const updatedStrain = await Strains.findByPk(strainId);
      return res.status(200).json(updatedStrain);
    } else {
      return res.status(400).json({
        message: `Cannot update retail strain with id=${strainId}. Maybe retail strain was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStrain = async (req: Request, res: Response) => {
  try {
    const strainId = +req.params.id;
    await Strains.destroy({
      where: { strainId: strainId },
    });
    return res.status(200).json(`Retail Strain ${strainId} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllStrains = async (req: Request, res: Response) => {
  try {
    const deletedStrains = await Strains.destroy({
      where: {},
      truncate: false,
    });
    return res.status(200).json(`Deleted ${deletedStrains} Retail Strains`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
