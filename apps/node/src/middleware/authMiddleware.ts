import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Customers from "../models/customers.model.js";
import { v4 as uuidv4 } from "uuid";
import propelAuth from "../utils/propelAuth.js";

const privateKey = process.env.SERVICE_API_KEY as string;

export const authenticateB2CToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const token = bearerToken.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const decodedToken = jwt.verify(token, privateKey);

    if (decodedToken.sub) {
      const currentUser: any = await Customers.findOne({
        where: { id: decodedToken.sub },
      });
      if (!currentUser) {
        return res
          .status(401)
          .json({ message: "Access denied. User Does not exist." });
      }
      req.user = currentUser;
      return next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Access denied. Invalid token." });
  }
};

export const authenticateServiceApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey) {
    if (apiKey === process.env.SERVICE_API_KEY) {
      return next();
    }
  } else {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });
      }
      const token = bearerToken.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "Access denied. No token provided." });
      }

      const decodedToken = jwt.verify(token, privateKey);

      if (decodedToken) {
        const currentUser = await Customers.findOne({
          where: { email: decodedToken.sub },
        });
        if (!currentUser) {
          return res
            .status(401)
            .json({ message: "Access denied. User Does not exist." });
        }
        req.user = currentUser as any;
        return next();
      }
    } catch (err) {
      return await propelAuth.requireUser(req, res, next);
    }
  }

  return res.status(401).json({ message: "Unauthorized service" });
};

export const authenticateSeaplaneApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === process.env.SEAPLANE_CONNECTOR_API_KEY) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized service" });
};

export const authenticateEmailToken = async (token: string) => {
  if (!token) {
    return { message: "Access denied. No token provided." };
  }
  try {
    const decodedToken = jwt.verify(token, privateKey);

    if (decodedToken && typeof decodedToken.sub !== "function") {
      const { sub } = decodedToken;
      const customer = await Customers.findByPk(sub);
      if (!customer) {
        return {
          customerId: null,
          message: "Access denied. User Does not exist.",
        };
      }
      const { dataValues } = customer;
      const { customerId } = dataValues;
      return {
        customerId: customerId,
        message: "Access Granted. Token Validated.",
      };
    }
    return { customerId: null, message: "Access denied. Invalid token." };
  } catch (error) {
    return { customerId: null, message: "Access denied. Invalid token." };
  }
};

export const authenticateGrafana = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !isGrafanaAuthorized(authHeader)) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    return res.status(401).send("Unauthorized");
  }
  next();
  return;
};

const isGrafanaAuthorized = (authHeader: string) => {
  const encodedCredentials = authHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString(
    "utf-8",
  );
  const [username, password] = decodedCredentials.split(":");

  return (
    username === process.env.GRAFANA_USERNAME &&
    password === process.env.GRAFANA_PASSWORD
  );
};

export const generateB2CAuthToken = (customer: Customers) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const token = jwt.sign(
    {
      sub: customer.id,
      iss: "Flora",
      exp: exp,
      role: "Customer",
      jti: uuidv4(),
    },
    privateKey,
  );
  return token;
};
