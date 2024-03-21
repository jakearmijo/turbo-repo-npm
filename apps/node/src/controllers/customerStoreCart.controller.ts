import axios from "axios";
import { Request, Response } from "express";
import redisService from "../utils/redisService.js";
import CustomerStoreCart from "../models/carts.model.js";

export const getUserCartFromCache = async (req: Request, res: Response) => {
  const redisClient = await redisService.getClient();
  const { storeId, customerId } = req.params;
  try {
    const cartItems = await redisClient.hGet(
      "cartItems",
      `${customerId}:${storeId}`,
    );
    return res.status(200).json(JSON.parse(cartItems));
  } catch (error) {
    return res
      .status(200)
      .json({ message: "There is no cart data for the user in cache" });
  }
};

export const setUserCartInCache = async (req: Request, res: Response) => {
  const redisClient = await redisService.getClient();
  const { storeId, customerId, cartItems }: any = req.body;
  const _cartItems = [];
  for (const item of cartItems) {
    _cartItems.push({
      itemId: item.id,
      quantity: item.quantity,
    });
  }
  try {
    await redisClient.hSet(
      "cartItems",
      `${customerId}:${storeId}`,
      JSON.stringify(cartItems),
    );
    return res.status(200).json({ message: "Cart set in cache" });
  } catch (error) {
    return res.status(200).json({ message: "Error setting cart in cache" });
  }
};

// if dutchie order is created successfully then delete cart from cache and insert into DB
export const createDutchieOrder = async (req: Request, res: Response) => {
  if (req.body.cartObject.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://flora.app.getgenetica.com/int/dutchie/preorder/submit`,
    headers: {
      company: "genetica-sandbox",
      location: "genetica-dutchie",
      "Content-Type": "application/json",
    },
    data: req.body.cartObject,
  };
  const dutchieGetProductsResult = await axios.request(config);
  const { data } = dutchieGetProductsResult;

  if (data.orderId) {
    const redisClient = await redisService.getClient();
    const { storeId, customerId } = req.body;
    try {
      const bulkCreateData = [];
      for (const item of req.body.cartObject.items) {
        const cartRow = {
          store_id: storeId,
          customer_id: customerId,
          item_id: item.productId,
          quantity: item.quantity,
          createdBy: 1,
          updatedBy: 1,
        };
        bulkCreateData.push(cartRow);
      }
      const dbResponse = CustomerStoreCart.bulkCreate(bulkCreateData);
      const redisResponse = redisClient.hDel(
        "cartItems",
        `${customerId}:${storeId}`,
      );
      await Promise.all([dbResponse, redisResponse]);
      return res.status(200).json(JSON.stringify(data));
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting cart from cache or inserting DB" });
    }
  } else {
    return res.status(500).json({ message: "Error creating order" });
  }
};
