import * as dotenv from "dotenv";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";

dotenv.config();

interface Secret {
  host: string;
  username: string;
  password: string;
  dbname: string;
}

export class SecretsManagerClass {
  private client: SecretsManagerClient;

  constructor() {
    const config = {
      maxAttempts: 3,
      region: "us-east-2",
    };

    this.client = new SecretsManagerClient(config);
  }

  async getFloraDbSecret(): Promise<Secret> {
    const input: GetSecretValueCommandInput = {
      SecretId: process.env.FLORA_AURORA_SECRET_ARN,
    };

    const command = new GetSecretValueCommand(input);
    const response: GetSecretValueCommandOutput =
      await this.client.send(command);
    const secretObject = JSON.parse(response?.SecretString as string);

    return secretObject;
  }

  async getCoreDbSecret(): Promise<Secret> {
    const input: GetSecretValueCommandInput = {
      SecretId: process.env.FLORA_CORE_SECRET_ARN,
    };

    const command = new GetSecretValueCommand(input);
    const response: GetSecretValueCommandOutput =
      await this.client.send(command);
    const secretObject = JSON.parse(response?.SecretString as string);

    return secretObject;
  }
}

export default SecretsManagerClass;
