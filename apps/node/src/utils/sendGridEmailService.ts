import { MailService } from "@sendgrid/mail";
import logger from "../middleware/logger/index.js";

export class SendgridEmailService {
  private emailClient: MailService;

  constructor() {
    this.emailClient = new MailService();
    this.emailClient.setApiKey(process.env.SENDGRID_API_KEY!); // Assuming SENDGRID_API_KEY is always defined
  }

  async sendToTemplate(
    templateId: string,
    email: string,
    templateData: any,
  ): Promise<boolean> {
    try {
      const msg = {
        to: email,
        from: "support@getgenetica.com",
        templateId,
        dynamicTemplateData: templateData,
      };
      await this.emailClient.send(msg);
      return true;
    } catch (error) {
      logger.error(
        "🚀 ~ file: sendgridEmailService.ts:21 ~ SendgridEmailService ~ sendToTemplate ~ error:",
        error,
      );
      return false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    templateData: any,
  ): Promise<boolean> {
    try {
      return this.sendToTemplate(
        "d-92326c6004d34bb5b683862beb13f3e4",
        email,
        templateData,
      );
    } catch (error) {
      logger.error(
        "🚀 ~ file: sendEmailService.ts:46 ~ SendgridTemplateSenderService ~ sendPasswordResetEmail ~ error:",
        error,
      );
      return false;
    }
  }

  async sendBudTenderPortalHelpRequestEmail(
    templateData: any,
  ): Promise<boolean> {
    const email = "support@getgenetica.com";
    try {
      return this.sendToTemplate(
        "d-6c70ab3742d24f2b903eee7f68913f08",
        email,
        templateData,
      );
    } catch (error) {
      logger.error(
        "🚀 ~ file: sendEmailService.ts:53 ~ SendgridTemplateSenderService ~ sendBudTenderPortalHelpRequestEmail ~ error:",
        error,
      );
      return false;
    }
  }
}
