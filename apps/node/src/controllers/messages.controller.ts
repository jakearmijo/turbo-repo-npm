import { Request, Response } from "express";
import logger from "../middleware/logger/index.js";
import Stores from "../models/stores.model.js";
import Messages from "../models/messages.model.js";

export const getAllStoresMessagesByChainId = async (
  req: Request,
  res: Response,
) => {
  try {
    const resultMsgs = [];

    const chainId = req.params.chainId;
    const stores = await Stores.findAll({
      where: { chainId: parseInt(chainId) },
      raw: true,
    });
    const storeIds = stores.map((s) => s.id);

    for (let i = 0; i < storeIds.length; i++) {
      const msgs = await Messages.findAll({
        where: { storeId: storeIds[i] },
      });
      resultMsgs.push(...msgs);
    }

    return res.status(200).json([...resultMsgs]);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ messege: error });
  }
};
