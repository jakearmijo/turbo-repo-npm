import { Op } from "sequelize";
import Ably, { Types } from "ably";
import Customers from "../models/customers.model.js";
import Queues from "../models/queues.model.js";
import Employees from "../models/employees.model.js";
import { slotStatuses } from "./common-functions.js";
import logger from "../middleware/logger/index.js";

class RealtimeServiceClass {
  private options: { key: string };
  private client: Ably.Realtime;

  constructor() {
    this.options = {
      key: process.env.ABLY_API_KEY_ROOT || "",
    };
    this.client = new Ably.Realtime(this.options);
    logger.info("🚀 ~ RealtimeServiceClass INIT");
  }

  private async connectToChannel(channelName: string) {
    const channel = this.client.channels.get(channelName);
    return channel;
  }

  async publishQueueMessage(
    channelName: string,
    messageData: any,
  ): Promise<{ message: string }> {
    try {
      const channel = await this.connectToChannel(channelName);
      channel.publish("receiveUpdatedQueue", messageData);
      return { message: `Retail store queue published to ${channelName}` };
    } catch (error: any) {
      logger.error(
        "🚀 ~ file: realtimeService.ts:35 ~ RealtimeServiceClass ~ error:",
        error,
      );
      return { message: error.message };
    }
  }

  async publishRecommendationMessage(channelName: string, messageData: any) {
    try {
      const channel = await this.connectToChannel(channelName);
      channel.publish(channelName, messageData);
      return {
        message: `Customer Recommendation published to ${channelName}`,
      };
    } catch (error: any) {
      logger.error(
        "🚀 ~ file: realtimeService.ts:51 ~ RealtimeServiceClass ~ publishRecommendationMessage ~ error:",
        error,
      );
      return { message: error.message };
    }
  }

  async getChannelPresence(channelName: string): Promise<void> {
    try {
      const channel = await this.connectToChannel(channelName);
      channel.presence.get();
    } catch (error) {
      logger.error(
        "🚀 ~ RealtimeServiceClass ~ enterChannelPresence= ~ error:",
        error,
      );
    }
  }

  async rehydrateRetailStoreQueue(storeId: number) {
    if (!storeId) {
      return { message: "Store Id is missing." };
    }

    try {
      logger.info("Rehydrating store queue");
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

      logger.info("Found store queues");

      if (queues.length > 0) {
        logger.info(`Publishing Message to store ${storeId} Bud Tender Portal`);
        return this.publishQueueMessage(
          `store-${storeId}-queue-${process.env.developement}`,
          queues,
        );
      } else {
        logger.error("REHYDRATE DID NOT FIND STORE QUEUE");
        return this.publishQueueMessage(
          `store-${storeId}-queue-${process.env.developement}`,
          [],
        );
      }
    } catch (error: any) {
      return { message: error.message };
    }
  }

  async sendUpdatedQueue(
    channel: Types.RealtimeChannelCallbacks,
    storeId: string,
  ) {
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

      channel.publish("receiveUpdatedQueue", queues);
    } catch (err) {
      logger.error("ABLY_REHYDRATE", err);
    }
  }

  async setupStoreRealtimeInteraction(storeId: string) {
    const name = `store-${storeId}-queue-${process.env.developement}`;
    const channel = await this.connectToChannel(name);

    channel.subscribe("updateQueue", async (msg) => {
      try {
        const { queueId, employeeId, status, storeId } = msg.data;
        await Queues.update(
          { employeeId, status },
          {
            where: { id: queueId },
          },
        ).finally(() => this.sendUpdatedQueue(channel, storeId));
      } catch (err) {
        logger.error("ABLY_UPDATE", err);
      }
    });

    channel.subscribe("getCustomers", async (msg: any) =>
      this.sendUpdatedQueue(channel, msg.data.storeId),
    );
  }
}

const realtimeService = new RealtimeServiceClass();

export default realtimeService;

/**
 *   // private async enterChannelPresence(channelName: string): Promise<void> {
  //   try {
  //     const channel = await this.connectToChannel(channelName);
  //     await channel.presence.enter();
  //   } catch (error) {
  //     logger.error("🚀 ~ RealtimeServiceClass ~ enterChannelPresence= ~ error:", error);
  //   }
  // }

  // private async updateChannelPresence(channelName: string, presenceUpdate: any): Promise<void> {
  //   try {
  //     const channel = await this.connectToChannel(channelName);
  //     await channel.presence.update(presenceUpdate);
  //   } catch (error) {
  //     logger.error("🚀 ~ RealtimeServiceClass ~ updateChannelPresence= ~ error:", error);
  //   }
  // }

  // private async leaveChannelPresence(channelName: string): Promise<void> {
  //   try {
  //     const channel = await this.connectToChannel(channelName);
  //     await channel.presence.leave();
  //   } catch (error) {
  //     logger.error("🚀 ~ RealtimeServiceClass ~ leaveChannelPresence= ~ error:", error);
  //   }
  // }

  // private async queryChannelHistory(channelName: string): Promise<any> {
  //   try {
  //     const channel = await this.connectToChannel(channelName);
  //     const history = await channel.history({ limit: 25 });
  //     return history;
  //   } catch (error) {
  //     logger.error("🚀 ~ RealtimeServiceClass ~ queryChannelHistory= ~ error:", error);
  //   }
  // }
 */
