import { Op } from "sequelize";
import { Request, Response } from "express";
import Customers from "../models/customers.model.js";
import Queues from "../models/queues.model.js";
import Employees from "../models/employees.model.js";
import { slotStatuses } from "../utils/common-functions.js";
import realtimeService from "../utils/realtimeService.js";
import logger from "../middleware/logger/index.js";

export const createCustomerQueue = async (req: Request, res: Response) => {
  if (!req.body.customerId) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }
  try {
    const customerQueue = {
      customerId: req.body.customerId,
      storeId:
        typeof req.body.storeId === "number"
          ? req.body.storeId
          : parseInt(req.body.storeId),
      employeeId: req.body.employeeId,
      status: req.body.status,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const newQueue = await Queues.create(customerQueue);

    if (newQueue) {
      const { dataValues } = newQueue;
      await realtimeService.rehydrateRetailStoreQueue(dataValues.storeId);
    }

    return res.status(200).json(newQueue);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllCustomerQueues = async (req: Request, res: Response) => {
  try {
    const allRetailCustomerQueues = await Queues.findAll();
    return res.status(200).json(allRetailCustomerQueues);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const findOneCustomerQueue = async (req: Request, res: Response) => {
  try {
    const customerQueueId = +req.params.id;
    const customerQueue = await Queues.findByPk(customerQueueId);
    return res.status(200).json(customerQueue);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCustomerQueue = async (req: Request, res: Response) => {
  const queueId = req.params.id;
  const { employeeId, status } = req.body;
  try {
    const rowsUpdated = await Queues.update(
      { employeeId, status },
      {
        where: { id: queueId },
      },
    );
    if (rowsUpdated) {
      const updatedRetailCustomerQueue = await Queues.findByPk(queueId);

      return res.status(200).json(updatedRetailCustomerQueue);
    } else {
      return res.status(400).json({
        message: `Cannot update retail customer queue with id=${queueId}. Maybe retail customer queue was not found or req.body is empty!`,
      });
    }
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllCustomerQueueByStoreId = async (
  req: Request,
  res: Response,
) => {
  const paramsStoreId = req.params.storeId;
  const storeId = parseInt(paramsStoreId);
  if (!storeId) {
    return res.status(400).json({ message: "No store Id was passed in" });
  }
  try {
    const deletedQueue = await Queues.destroy({
      where: { storeId: storeId },
    });
    if (deletedQueue) {
      await realtimeService.rehydrateRetailStoreQueue(storeId);
    }

    return res
      .status(200)
      .json(`Deleted ${deletedQueue} queues from store with id ${storeId}`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCustomerQueue = async (req: Request, res: Response) => {
  const { queueId, storeId } = req.params;
  try {
    // TODO: investigate this
    await Queues.destroy({
      where: { customerQueueId: queueId, storeId: storeId },
    });

    return res
      .status(200)
      .json(
        `Retail Customer Queue From Store with StoreId: ${storeId} and QueueId: ${queueId} has been deleted`,
      );
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllCustomerQueues = async (req: Request, res: Response) => {
  try {
    const deletedRetailCustomerQueue = await Queues.destroy({
      where: {},
      truncate: false,
    });
    return res
      .status(200)
      .json(`Deleted ${deletedRetailCustomerQueue} Retail Customer Queues`);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export const AddCustomerToQueue = async (req: Request, res: Response) => {
  if (!req.body.customerId) {
    return res.status(400).json({
      message: "Content can not be empty!",
    });
  }
  try {
    const customerQueue = {
      customerId: req.body.customerId,
      storeId:
        typeof req.body.storeId === "number"
          ? req.body.storeId
          : parseInt(req.body.storeId),
      employeeId: req.body.employeeId,
      status: req.body.status,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
    };

    const [newQueue, created] = await Queues.findOrCreate({
      where: {
        customerId: req.body.customerId,
        [Op.or]: [
          {
            status: slotStatuses.WAITING,
          },
          {
            status: slotStatuses.ASSIGNED,
          },
        ],
      },
      defaults: customerQueue,
    });

    if (newQueue && created) {
      const { dataValues } = newQueue;
      await realtimeService.rehydrateRetailStoreQueue(dataValues.storeId);
    }

    return res.status(200).json(newQueue);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCustomerQueuesByStoreIdREWORKED = async (
  req: Request,
  res: Response,
) => {
  const storeId = req.query.storeId;

  if (!storeId) {
    return res.status(400).json({ message: "Store Id is missing." });
  }

  try {
    const queues = await Queues.findAll({
      where: {
        storeId: storeId,
        status: {
          [Op.ne]: slotStatuses.COMPLETED,
        },
      },
      order: [["id", "ASC"]],
      include: [
        {
          model: Customers,
          as: "Customer",
        },
        {
          model: Employees,
          as: "Employee",
        },
      ],
    });

    // someone connected - TODO: check host to see if connected again
    realtimeService.setupStoreRealtimeInteraction(`${storeId}`);

    return res.status(200).json(queues);
  } catch (error: any) {
    logger.error(`message: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
