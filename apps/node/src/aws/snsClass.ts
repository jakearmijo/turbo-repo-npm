import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
} from "@aws-sdk/client-sns";
import logger from "../middleware/logger/index.js";

class SnsClass {
  private client: SNSClient;
  constructor() {
    const config = {
      maxAttempts: 3,
      region: "us-east-2",
    };

    this.client = new SNSClient(config);
  }

  async sendSMS(message: string, phoneNumber: string) {
    try {
      const input: PublishCommandInput = {
        Message: message,
        PhoneNumber: phoneNumber,
      };
      const publishCommand = new PublishCommand(input);

      const data: PublishCommandOutput = await this.client.send(publishCommand);
      return data?.MessageId;
    } catch (error) {
      logger.error(
        `Error sending message: ${message} to phone number ${phoneNumber}:`,
        error,
      );
      return `Error sending message: ${message} to phone number ${phoneNumber}`;
    }
  }
}

export default SnsClass;
