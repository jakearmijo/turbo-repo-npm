import axios from "axios";
import { Request, Response } from "express";
import {logger} from "../../../logger.js";
import floraSequelize from "../../../sequelize.js";
import { transformDutchieProductCatalogs } from "../dutchie/productCatalog.transforms.js";
import { transformDutchieInventories } from "../dutchie/inventories.transforms.js";
import { transformDutchieStrains } from "../dutchie/strains.transforms.js";
import { transformDutchieCustomers } from "../dutchie/customers.transforms.js";
import ProductCatalogs from "../../../models/productCatalogs.model.js";
import Inventories from "../../../models/inventories.model.js";
import Strains from "../../../models/strains.model.js";

export const dutchieProductCatalogTransform = async (
  req: Request,
  res: Response,
) => {
  const { company, storeId } = req.body;
  const t = await (await floraSequelize).transaction();
  try {
    const config = {
      method: "get",
      url: `https://flora.app.getgenetica.com/int/dutchie/products`,
      headers: {
        company: company,
        storeId: storeId,
      },
    };
    const dutchieGetProductsResult = await axios.request(config);
    const { data } = dutchieGetProductsResult;

    const transformedProductsArray = transformDutchieProductCatalogs(
      data,
      storeId,
    );

    if (Array.isArray(transformedProductsArray)) {
      await ProductCatalogs.bulkCreate(transformedProductsArray, {
        validate: true,
      });
      await t.commit();
      return res
        .status(200)
        .send({ message: "All Retail Product Catalog Items Were Created" });
    }
    await t.rollback();
    return res.status(400).send({
      message: "FAIL - Retail Product Catalog Items Were NOT Created",
    });
  } catch (error: any) {
    await t.rollback();
    logger.error(
      `🚀🚀🚀🚀 ~ file: dutchie.transforms.controller.js:31 ~ ${company} store id ${storeId} Product Catalog Import Rolled Back`,
    );
    return res.status(500).send({ message: error.message });
  }
};

export const dutchieInventoryTransform = async (
  req: Request,
  res: Response,
) => {
  const { company, storeId } = req.body;
  const t = await (await floraSequelize).transaction();
  try {
    const config = {
      method: "get",
      url: `https://flora.app.getgenetica.com/int/dutchie/inventory`,
      headers: {
        company: company,
        storeId: storeId,
      },
    };
    const dutchieGetInventoryResult = await axios.request(config);
    const { data } = dutchieGetInventoryResult;

    const transformedInventoryArray = transformDutchieInventories(
      data,
      storeId,
    );

    if (Array.isArray(transformedInventoryArray)) {
      await Inventories.bulkCreate(transformedInventoryArray, {
        validate: true,
      });
      await t.commit();
      return res
        .status(200)
        .send({ message: "All Retail Product Inventory Items Were Created" });
    }
    await t.rollback();
    return res.status(400).send({
      message: "Fail - All Retail Product Inventory Items Were NOT Created",
    });
  } catch (error: any) {
    logger.error(
      "🚀🚀🚀🚀 ~ file: dutchie.transforms.controller.js:73 ~ dutchieInventoryTransform ~ error:",
      error,
    );
    await t.rollback();
    return res.status(500).send({ message: error.message });
  }
};

export const dutchieStrainsTransform = async (req: Request, res: Response) => {
  const { company, storeId } = req.body;
  const t = await (await floraSequelize).transaction();
  try {
    const config = {
      method: "get",
      url: `https://flora.app.getgenetica.com/int/dutchie/strains`,
      headers: {
        company: company,
        storeId: storeId,
      },
    };
    const dutchieGetStrainsResult = await axios.request(config);
    const { data } = dutchieGetStrainsResult;

    const transformedStrainsArray = transformDutchieStrains(data);

    if (Array.isArray(transformedStrainsArray)) {
      await Strains.bulkCreate(transformedStrainsArray, {
        validate: true,
      });
      await t.commit();
      return res
        .status(200)
        .send({ message: "All Retail Strains Were Created" });
    }
    await t.rollback();
    return res
      .status(400)
      .send({ message: "Fail - All Retail Strains Were NOT Created" });
  } catch (error: any) {
    logger.error(
      "🚀🚀🚀🚀 ~ file: dutchie.transforms.controller.js:123 ~ dutchieStrainsTransform ~ error:",
      error,
    );
    await t.rollback();
    return res.status(500).send({ message: error.message });
  }
};

export const dutchieCustomersTransform = async (
  req: Request,
  res: Response,
) => {
  const { company, storeId } = req.body;
  const t = await (await floraSequelize).transaction();
  try {
    let config = {
      method: "get",
      url: `https://flora.app.getgenetica.com/int/dutchie/customers`,
      headers: {
        company: company,
        storeId: storeId,
      },
    };
    const dutchieGetCustomerResult = await axios.request(config);
    const { data } = dutchieGetCustomerResult;

    let transformedCustomersArray = transformDutchieCustomers(data, storeId);

    if (Array.isArray(transformedCustomersArray)) {
      await Strains.bulkCreate(transformedCustomersArray, {
        validate: true,
      });
      await t.commit();
      return res.status(200).send({ message: "All Customer Were Created" });
    }
    await t.rollback();
    return res
      .status(400)
      .send({ message: "Fail - All Customer Were NOT Created" });
  } catch (error: any) {
    logger.error(
      "🚀 ~ file: dutchie.transforms.controller.ts:176 ~ dutchieCustomersTransform ~ error:",
      error,
    );
    await t.rollback();
    return res.status(500).send({ message: error.message });
  }
};
