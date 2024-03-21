import { Request, Response } from "express";
import { Op } from "sequelize";
import IdTypes from "../models/idTypes.model.js";
import logger from "../middleware/logger/index.js";
import Stores from "../models/stores.model.js";

export const createIdType = async (req: Request, res: Response) => {
  if (!req.body.retailidtype_name) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }

  try {
    const retailidtypes = {
      name: req.body.retailidtype_name,
      desc: req.body.retailidtype_desc,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const newIdType = await IdTypes.create(retailidtypes);

    return res.status(200).json(newIdType);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllIdTypes = async (req: Request, res: Response) => {
  try {
    const allRetailIdDocs: IdTypes[] = await IdTypes.findAll();
    return res.status(200).json(allRetailIdDocs);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneIdType = async (req: Request, res: Response) => {
  try {
    const IdTypeId = +req.params.id;
    const idType = await IdTypes.findByPk(IdTypeId);
    return res.status(200).json(idType);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateIdType = async (req: Request, res: Response) => {
  try {
    const IdTypeId = +req.params.id;
    const rowsUpdated = await IdTypes.update(req.body, {
      where: { IdTypeId: IdTypeId },
    });
    if (rowsUpdated) {
      const updatedIdType = await IdTypes.findByPk(IdTypeId);
      return res.status(200).json(updatedIdType);
    } else {
      return res.status(400).json({
        message: `Cannot update retail ID type with id=${IdTypeId}. Maybe retail ID type was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteIdType = async (req: Request, res: Response) => {
  try {
    const IdTypeId = +req.params.id;
    await IdTypes.destroy({
      where: { IdTypeId: IdTypeId },
    });
    return res.status(200).json(`Retail Id Type ${IdTypeId} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllIdTypes = async (req: Request, res: Response) => {
  try {
    const deletedIdType = await IdTypes.destroy({
      where: {},
      truncate: false,
    });
    return res.status(200).json(`Deleted ${deletedIdType} Retail Id Types`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getIdTypesByState = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.id;

    if (!storeId)
      return res.status(400).json({ message: "Store Id is msissing." });

    const store = await Stores.findOne({
      where: { id: storeId },
      raw: true,
    });

    if (store != null) {
      const { state } = store;

      const stateIds = await IdTypes.findAll({
        where: {
          states: {
            [Op.contains]: [state],
          },
        },
      });

      if (stateIds != null) {
        return res.status(200).json(stateIds);
      } else {
        return res.status(404).json({ message: "Ids were not found!" });
      }
    } else {
      return res.status(404).json({ message: "Store was not found!" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
