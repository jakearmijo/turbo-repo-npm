import { Request, Response } from "express";
import Stores from "../models/stores.model.js";
import redisService from "../utils/redisService.js";
import * as floraTypes from "@repo/types";
const { StoresSchema } = floraTypes;
import logger from "../middleware/logger/index.js";

export const createStore = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.state) {
    res.status(400).json({
      message: "Content can not be empty!",
    });
    return;
  }
  try {
    const storeInput = StoresSchema.safeParse(req.body);
    if (!storeInput.success) {
      logger.error("createStore - storeInput.error", storeInput);
      return res.status(400).json({ message: storeInput });
    }
    const newStore = await Stores.create(storeInput);
    const redisClient = await redisService.getClient();
    redisClient.hSet(
      process.env.REDIS_KEY_STORES,
      newStore.id,
      JSON.stringify(newStore),
    );

    return res.status(200).json(newStore);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const storeInput = StoresSchema.safeParse(req.body);
    if (!storeInput.success) {
      logger.error("updateStore - storeInput.error", storeInput);
      return res.status(400).json({ message: storeInput });
    }
    const rowsUpdated = await Stores.update(storeInput, {
      where: { id: id },
    });
    if (rowsUpdated) {
      const updatedStore = await Stores.findByPk(id);
      return res.status(200).json(updatedStore);
    } else {
      return res.status(400).json({
        message: `Cannot update retail store with id=${id}. Maybe retail store was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.id;

    const cachedStore = await redisService?.tryHGet(
      process.env.REDIS_KEY_STORES || "",
      storeId,
    );

    if (!!cachedStore) {
      const cachedStoreObject = JSON.parse(cachedStore);
      return res.status(200).json(cachedStoreObject);
    }

    const data = await Stores.findByPk(storeId);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Store with given Id not found!" });
    }

    // write to cache
    redisService.tryHSet(
      process.env.REDIS_KEY_STORES || "",
      storeId,
      JSON.stringify(data),
    );

    return res.status(200).json(data);
  } catch (error: any) {
    logger.error(`getStoreById - message: `, error);
    return res.status(500).json({ message: error.message });
  }
};

export const getStoresOfTheSameChainByStoreId = async (
  req: Request,
  res: Response,
) => {
  try {
    const storeId = req.params.storeId;

    if (!storeId) {
      return res.status(400).json({ message: "Store id missing." });
    }

    //get chain id for this store id
    const chainId = await getChainIdByStoreId(storeId);
    if (chainId == 0) {
      return res.status(400).json({ message: "Invalid or mising Store Id" });
    }
    const stores = await Stores.findAll({
      where: { chainId: chainId },
      order: [["chainId", "ASC"]],
    });
    if (stores != null) {
      return res.status(200).json(stores);
    } else {
      return res.status(404).json({ message: "No stores found!" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Error" });
  }
};

const getChainIdByStoreId = async (storeId: string) => {
  try {
    //search the cache first
    const cachedStore = await redisService.tryHGet(
      process.env.REDIS_KEY_STORES || "",
      `${storeId}`,
    );
    if (cachedStore) {
      const cachedStoreObject = JSON.parse(cachedStore);
      return cachedStoreObject.chainId;
    }
    const store = await Stores.findByPk(storeId);
    if (store != null) {
      return store.chainId;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
};

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const redisClient = await redisService.getClient();
    const allCachedStores = await redisClient.get(process.env.REDIS_KEY_STORES);

    if (allCachedStores) {
      return res.status(200).json(JSON.parse(allCachedStores));
    }

    const allStores = await Stores.findAll();
    const storesJson = JSON.stringify(allStores);
    await redisClient.set("Stores", storesJson);

    return res.status(200).json(allStores);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRetailStore = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    await Stores.destroy({
      where: { id: id },
    });
    return res.status(200).json(`Retail Store ${id} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllRetailStores = async (req: Request, res: Response) => {
  try {
    const deletedRetailStores = await Stores.destroy({
      where: {},
      truncate: false,
    });
    return res.status(200).json(`Deleted ${deletedRetailStores} Retail Stores`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getStoresByExternalOrgId = async (req: Request, res: Response) => {
  try {
    const externalOrgId = req.params.extOrgId;
    if (!externalOrgId) {
      return res.status(400).json({
        message: `Missing external org Id`,
      });
    }

    const stores = await Stores.findAll({
      where: {
        externalOrgId: externalOrgId,
      },
    });

    if (!stores?.length) {
      return res.status(404).json({
        message: `Could not find stores with externalId: ${externalOrgId}`,
      });
    }
    return res.status(200).json(stores);
  } catch (err) {
    const msg = `Error getting stores by external OrgId: ${err}`;
    logger.error(msg);
    return res.status(500).json({ message: msg });
  }
};
