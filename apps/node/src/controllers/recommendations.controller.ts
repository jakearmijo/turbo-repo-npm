import { Request, Response } from "express";
import Recommendations from "../models/recommendations.model.js";
import logger from "../middleware/logger/index.js";
import Inventories from "../models/inventories.model.js";

export const createCustomerRecommendation = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.body.customerId) {
      res.status(400).json({
        message: "Content can not be empty!",
      });
      return;
    }

    const recommendation = {
      customerId: req.body.customerId,
      retailinventory_id: req.body.retailinventory_id || null,
      storeId: req.body.storeId,
      retailformrequest_id: req.body.retailformrequest_id,
      category: req.body.category,
      subCategory: req.body.subCategory,
      products: req.body.products,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const newCustomerRecommendation =
      await Recommendations.create(recommendation);

    return res.status(200).json(newCustomerRecommendation);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllCustomerRecommendations = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId = req.query.customerId;

    const allCustomerRecommendations: Recommendations[] =
      await Recommendations.findAll({
        where: { customerId: customerId },
      });
    return res.status(200).json(allCustomerRecommendations);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneCustomerRecommendation = async (
  req: Request,
  res: Response,
) => {
  try {
    const retailcustomerrecommendation_id = +req.params.id;
    const retailCustomer = await Recommendations.findByPk(
      retailcustomerrecommendation_id,
    );
    return res.status(200).json(retailCustomer);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCustomerRecommendation = async (
  req: Request,
  res: Response,
) => {
  try {
    const retailcustomerrecommendation_id = +req.params.id;
    const rowsUpdated = await Recommendations.update(req.body, {
      where: {
        id: retailcustomerrecommendation_id,
      },
    });
    if (rowsUpdated) {
      const updatedRetailCustomerRecommendation =
        await Recommendations.findByPk(retailcustomerrecommendation_id);
      return res.status(200).json(updatedRetailCustomerRecommendation);
    } else {
      return res.status(400).json({
        message: `Cannot update retail customer recommendation with id=${retailcustomerrecommendation_id}. Maybe retail customer recommendation was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCustomerRecommendation = async (
  req: Request,
  res: Response,
) => {
  try {
    const retailcustomerrecommendation_id = +req.params.id;
    await Recommendations.destroy({
      where: {
        id: retailcustomerrecommendation_id,
      },
    });
    return res
      .status(200)
      .json(
        `Retail Customer Recommendation ${retailcustomerrecommendation_id} Deleted`,
      );
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllCustomerRecommendations = async (
  req: Request,
  res: Response,
) => {
  try {
    const deletedRetailCustomerRecommendations = await Recommendations.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(200)
      .json(
        `Deleted ${deletedRetailCustomerRecommendations} Retail Customer Recommendations`,
      );
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const shuffle = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const getRecommendationsForCustomerFallback = async (
  req: Request,
  res: Response,
) => {
  try {
    const { category, storeId, customerId } = req.query;
    const parsedStoreId = parseInt(storeId as string);
    const parsedCategory = category?.toString() as string;
    const categories = parsedCategory.split(",");

    const products = await Inventories.findAll({
      where: {
        storeId: parsedStoreId,
        category: categories,
      },
      raw: true,
      nest: true,
    });

    const shuffledProducts = shuffle(products);
    const randomElements = shuffledProducts.slice(0, 6);
    const result = randomElements.map((product: any) => product);

    const recommendationData = {
      customerId:
        typeof customerId === "string" ? parseInt(customerId) : customerId,
      retailinventory_id: null,
      storeId: storeId,
      retailformrequest_id: null,
      category: result[0].category || "TBD",
      subCategory: result[0].subCategory || "TBD",
      products: JSON.stringify(result),
      seaplaneRequestId: req.body.request_id,
      createdBy: 99,
      updatedBy: 99,
    };

    await Recommendations.create(recommendationData);

    return res.status(200).json(result);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getRecommendationsForCustomerByCustomerId = async (
  req: Request,
  res: Response,
) => {
  try {
    const { customerId } = req.params;

    if (!customerId)
      return res.status(400).json({ message: "Customer Id is missing." });

    const recommendation = await Recommendations.findOne({
      where: { customerId: customerId },
      order: [["createdAt", "DESC"]],
    });

    if (recommendation) {
      const productsArray = recommendation.products;
      return res.status(200).json(productsArray);
    }

    return res
      .status(404)
      .json({ message: "Can't find customer recommendation" });
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const getRecommendationForMatchAppCustomer = async (
  req: Request,
  res: Response,
) => {
  try {
    const { customerId } = req.params;
    const seaplaneRequestId = req.query.seaplaneRequestId;

    if (!customerId || !seaplaneRequestId)
      return res
        .status(400)
        .json({ message: "Customer Id OR Seaplane Request Id is missing." });

    const recommendations = await Recommendations.findAll({
      where: {
        customerId: customerId,
        sesPlaneRequestId: seaplaneRequestId,
      },
      raw: true,
      nest: true,
    });

    if (recommendations) {
      const productsArray = recommendations.map((recommendation) => {
        return recommendation.products;
      });

      return res.status(200).json(productsArray);
    }

    return res.status(200).json([]);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
