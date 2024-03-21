import { Request, Response } from "express";
import { FindOptions, Order } from "sequelize";
import ProductReviews from "../models/productReviews.model.js";
import logger from "../middleware/logger/index.js";

export const getAllProductReviewsByCustomerId = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const { customerId, page, pageSize } = req.query;

    if (!customerId)
      return res.status(400).json({ message: "Customer Id is missing." });

    const options: FindOptions = {
      where: { customer_id: customerId },
      offset:
        page && pageSize
          ? (parseInt(page.toString()) - 1) * parseInt(pageSize?.toString())
          : 0,
      limit: pageSize ? parseInt(pageSize.toString()) : undefined,
      order: [["id", "DESC"]] as Order,
    };
    const reviews = await ProductReviews.findAll(options);
    return res.status(200).json(reviews);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const saveProductReview = async (req: Request, res: Response) => {
  try {
    const { customer_id, product_id } = req.body;

    if (!customer_id || !product_id)
      return res
        .status(400)
        .json({ message: "Customer Id or Product Id is missing." });

    const review = await ProductReviews.create({
      ...req.body,
    });

    return res.status(200).json(review);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
