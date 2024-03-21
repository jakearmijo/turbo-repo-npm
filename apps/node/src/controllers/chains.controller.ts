import { Request, Response } from "express";
import * as floraTypes from "@repo/types";
const { CreateChainSchema } = floraTypes;
import Chains from "../models/chains.model.js";
import redisService from "../utils/redisService.js";
import logger from "../middleware/logger/index.js";
import floraSequelize from "../sequelize.js";
import propelAuth from "../utils/propelAuth.js";

export const createChain = async (req: Request, res: Response) => {
  if (!req.body || !Object.keys(req?.body).length) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }

  let tempOrg = undefined;
  const t = await (await floraSequelize).transaction();
  try {
    const orgName = req.body.name;

    const doesChainExist = await Chains.findOne({
      where: {
        name: orgName,
      },
    });

    if (doesChainExist) {
      return res.status(400).json({
        message: "Chain with that email already exists!",
      });
    }

    const chainInput = CreateChainSchema.safeParse(req.body);
    if (!chainInput.success) {
      logger.error("chainInput.error", chainInput);
      return res.status(400).json({ message: chainInput });
    }

    const propelOrg = await propelAuth.createOrg({
      name: orgName,
    });
    tempOrg = propelOrg;
    const lowerCaseNameString = chainInput.data.name.toLowerCase();
    const formattedLowerCaseWithHyphensString = lowerCaseNameString.replace(
      /\s+/g,
      "-",
    );

    chainInput.data.name = formattedLowerCaseWithHyphensString;
    const newChain = await Chains.create(chainInput, { transaction: t });
    const redisClient = await redisService.getClient();
    redisClient.hSet(
      process.env.REDIS_KEY_CHAINS,
      newChain.id,
      JSON.stringify(newChain),
    );

    await t.commit();

    return res.status(200).json(newChain);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    t.rollback();

    if (tempOrg?.orgId) {
      await propelAuth.deleteOrg(tempOrg.orgId);
    }

    logger.error(`Failed to create chain with name: ${req.body.name}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllChains = async (req: Request, res: Response) => {
  try {
    const redisClient = await redisService.getClient();
    const allCachedChains = await redisClient.get("Chains");

    if (allCachedChains) {
      return res.status(200).json(JSON.parse(allCachedChains));
    }

    const allChains = await Chains.findAll();
    allChains.forEach((chain) => {
      redisClient.hSet(
        process.env.REDIS_KEY_CHAINS,
        chain?.id,
        JSON.stringify(chain),
      );
    });

    return res.status(200).json(allChains);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneChain = async (req: Request, res: Response) => {
  try {
    const chainId = +req.params.id;
    const redisClient = await redisService.getClient();
    const cachedChain = await redisClient.hGet(
      process.env.REDIS_KEY_CHAINS,
      chainId,
    );
    if (cachedChain) {
      return res.status(200).json(JSON.parse(cachedChain));
    }
    const chain = await Chains.findByPk(chainId);
    return res.status(200).json(chain);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateChain = async (req: Request, res: Response) => {
  try {
    const rowsUpdated = await Chains.update(req.body, {
      where: { id: req.params?.id },
    });
    if (rowsUpdated) {
      const updatedChain = await Chains.findByPk(req.params?.id);
      const redisClient = await redisService.getClient();
      redisClient.hSet(
        process.env.REDIS_KEY_CHAINS,
        updatedChain?.id,
        JSON.stringify(updatedChain),
      );
      return res.status(200).json(updatedChain);
    } else {
      return res.status(400).json({
        message: `Cannot update retail chain with id=${req.params?.id}. Maybe retail chain was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteChain = async (req: Request, res: Response) => {
  try {
    const chainId = +req.params.id;
    const redisClient = await redisService.getClient();
    const cachedChain = await redisClient.hGet(
      process.env.REDIS_KEY_CHAINS,
      chainId,
    );
    if (cachedChain) {
      return res.status(200).json(JSON.parse(cachedChain));
    }
    const chain = await Chains.findByPk(chainId);

    if (chain?.externalOrgId) {
      await propelAuth.deleteOrg(chain?.externalOrgId);
    }
    await Chains.destroy({
      where: { id: chainId },
    });

    return res.status(200).json(`Chain ${chainId} Deleted`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllChains = async (req: Request, res: Response) => {
  try {
    const deletedRetailChains = await Chains.destroy({
      where: {},
      truncate: false,
    });
    return res.status(200).json(`Deleted ${deletedRetailChains} Chains`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
