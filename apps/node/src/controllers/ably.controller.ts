import Ably from "ably";
import { Response, Request } from "express";
import { v4 as uuid } from "uuid";

const rest = new Ably.Rest(process.env.ABLY_API_KEY_ROOT as string);

export const createTokenRequest = (_req: Request, res: Response) => {
  const tokenParams = {
    clientId: uuid(),
  };
  rest.auth.createTokenRequest(tokenParams, (err: any, tokenRequest: any) => {
    if (err) {
      return res
        .status(500)
        .send("Error requesting token: " + JSON.stringify(err));
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify(tokenRequest));
  });
};
