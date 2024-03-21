import { Request, Response } from "express";
import Recommendations from "../models/recommendations.model.js";
import realtimeService from "../utils/realtimeService.js";
import logger from "../middleware/logger/index.js";

export const recommendationV2 = async (req: Request, res: Response) => {
  const defaultResponse = "Ask Your Bud Tender";
  logger.debug(
    "🚀 ~ file: seaplane.controller.js:5 ~ recommendationV2 ~ req.body:",
    req.body,
  );

  try {
    const recommendation = req.body.recommendation;

    const parsedRecommendations = recommendation.map((recommendation: any) => {
      return {
        id: recommendation?.product_information?.productid,
        name: recommendation?.product_information?.cleanproduct,
        strainName:
          recommendation?.product_information?.strainname ||
          recommendation?.product_information?.strain,
        category: recommendation?.product_information?.mastercategory,
        subCategory: recommendation?.product_information?.category,
        description:
          recommendation?.product_information?.genetica_description ||
          defaultResponse,
        recommendationReason: recommendation?.description || defaultResponse,
        effects: recommendation?.product_information["Top Effects List"] || "",
        flavors: recommendation?.product_information?.flavors || "",
        terpenes: recommendation?.product_information?.terpenes || "",
        cannabinoids: recommendation?.product_information?.cannabinoids || "",
        ishybrid:
          recommendation?.product_information?.ishybrid || defaultResponse,
        price: recommendation?.product_information?.unitprice,
        available: recommendation?.product_information?.quantityavailable,
        productgrams:
          recommendation?.product_information?.unitweightunit ||
          defaultResponse,
        thccontent:
          recommendation?.product_information?.thccontent || defaultResponse,
        cbdcontent:
          recommendation?.product_information?.cbdcontent || defaultResponse,
        unittype: recommendation?.product_information?.unitweightunit,
        image: recommendation?.product_information?.imageurl,
      };
    });

    const messageData = {
      seaplane_request_id: req.body.request_id,
      customerId: req.body.customerId,
      products: JSON.stringify(parsedRecommendations),
    };

    logger.info(
      `sending publishRecommendationMessage -- customer-recommendation-${req.body.customerId}`,
    );

    await realtimeService.publishRecommendationMessage(
      `customer-recommendation-${req.body.customerId}`,
      messageData,
    );

    const recommendationData = {
      customerId: req.body.customerId,
      inventoryId: req.body.retailinventory_id || null,
      storeId: req.body.storeId,
      formRequestId: req.body.retailformrequest_id || null,
      category: recommendation[0].product_information.mastercategory || "TBD",
      subCategory: recommendation[0].product_information.category || "TBD",
      products: JSON.stringify(parsedRecommendations),
      seaplaneRequestId: req.body.request_id,
      createdBy: 99,
      updatedBy: 99,
    };

    const newCustomerRecommendation =
      await Recommendations.create(recommendationData);

    if (newCustomerRecommendation) {
      return res.status(200).json({
        message:
          "Seaplane webhook received data and added Retail Recommendation to the DB",
      });
    }

    return res.status(500).json({ message: "No Recommendation Body Found" });
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
