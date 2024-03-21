import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  GetObjectCommandInput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import logger from "../middleware/logger/index.js";

class S3Class {
  private client: S3Client;
  constructor() {
    const config = {
      maxAttempts: 3,
      region: "us-east-2",
    };

    this.client = new S3Client(config);
  }

  async uploadToS3(
    folderPath: string,
    objectKey: string,
    imageBuffer: any,
    contentType: any,
  ) {
    try {
      const params: PutObjectCommandInput = {
        Bucket: `flora-bucket-main`,
        Key: `${folderPath}/${objectKey}`,
        Body: imageBuffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);
      const response: PutObjectCommandOutput = await this.client.send(command);
      logger.info(`Object uploaded successfully. ETag: ${response.ETag}`);
      return response;
    } catch (error) {
      logger.error("Error uploading object to S3:", error);
      throw error;
    }
  }

  async getObjectFromS3(folderPath: string, objectKey: string) {
    try {
      const params: GetObjectCommandInput = {
        Bucket: `flora-bucket-main`,
        Key: `${folderPath}/${objectKey}`,
      };

      const command = new GetObjectCommand(params);
      const response: GetObjectCommandOutput = await this.client.send(command);
      logger.info(`Object uploaded successfully. ETag: ${response.ETag}`);
      return response;
    } catch (error) {
      logger.error("Error uploading object to S3:", error);
      throw error;
    }
  }
}

export default S3Class;
