import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import responseTime from "response-time";
// import { logger } from "./logger";
import floraSequelize from "./sequelize.js";
import redisService from "./utils/redisService.js";
import * as PrometheusClient from "prom-client";

import categoriesRouter from "./routes/categories.routes.js";
import chainsRouter from "./routes/chains.routes.js";
import customerQueuesRouter from "./routes/queues.routes.js";
import customerRecommendationsRouter from "./routes/recommendations.routes.js";
import customersRouter from "./routes/customers.routes.js";
import formRequestsRouter from "./routes/formRequests.routes.js";
import idTypesRouter from "./routes/idTypes.routes.js";
import inventoriesRouter from "./routes/inventories.routes.js";
import productCatalogsRouter from "./routes/productCatalogs.routes.js";
import productReviewsRouter from "./routes/productReviews.routes.js";
import storeEmployeesRouter from "./routes/employees.routes.js";
import storesRouter from "./routes/stores.routes.js";
import strainsRouter from "./routes/strains.routes.js";

import dutchieTransformerRouter from "./data-processing/transforms/routes/dutchie.transforms.routes.js";

import ablyRouter from "./routes/ably.routes.js";
import seaPlaneRouter from "./routes/seaplane.routes.js";
import CustomerStoreCartRouter from "./routes/storeCarts.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import messagesRouter from "./routes/messages.routes.js";

// const floraApiVersion = process.env.FLORA_API_VERSION;

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8082;

const additionalCorsOrgins = process.env?.ALLOWED_URLS?.split(",") || [];

const corsOptions = {
  origin: [
    "https://flora.app.getgenetica.com",
    "https://flora.staging.getgenetica.com",
    "https://flora.demo.getgenetica.com",
    "https://faro-collector-prod-us-east-0.grafana.net/collect/d7f0fd672f492bbd7733c1bafce15e44",
    ...additionalCorsOrgins,
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");

// ***TODO: API VERSIONING IS NOT IMPLEMENTED YET ON FRONTEND***

// app.use("/api/${floraApiVersion}/ably", ablyRouter);
// app.use("/api/${floraApiVersion}/categories", retailCategoriesRouter);
// app.use("/api/${floraApiVersion}/chains", retailChainsRouter);
// app.use("/api/${floraApiVersion}/customer/queues", retailCustomerQueuesRouter);
// app.use(
//   "/api/${floraApiVersion}/customer/recommendations",
//   retailCustomerRecommendationsRouter,
// );

app.use("/mapi/v1/ably", ablyRouter);
app.use(`/mapi/v1/analytics`, analyticsRouter);
app.use("/mapi/v1/categories", categoriesRouter);
app.use("/mapi/v1/chains", chainsRouter);
app.use("/mapi/v1/customer/queues", customerQueuesRouter);
app.use("/mapi/v1/customer/recommendations", customerRecommendationsRouter);
app.use("/mapi/v1/customers", customersRouter);
app.use("/mapi/v1/form/requests", formRequestsRouter);
app.use("/mapi/v1/id/types", idTypesRouter);
app.use("/mapi/v1/inventories", inventoriesRouter);
app.use(`/mapi/messages`, messagesRouter);
app.use("/mapi/v1/product/catalogs", productCatalogsRouter);
app.use("/mapi/v1/product/reviews", productReviewsRouter);
app.use("/mapi/v1/store/employees", storeEmployeesRouter);
app.use("/mapi/v1/stores", storesRouter);
app.use("/mapi/v1/strains", strainsRouter);
app.use("/mapi/v1/cart", CustomerStoreCartRouter);
app.use("/mapi/v1/messages", messagesRouter);

app.use("/mapi/v1/transform/dutchie", dutchieTransformerRouter);

app.use("/mapi/seaplane", seaPlaneRouter);
// app.use(`/api/retail/product/catalogs`, retailProductCatalogsRouter);
// app.use(`/api/${floraApiVersion}/product/reviews`, retailProductReviewsRouter);
// app.use(`/api/${floraApiVersion}/store/employees`, retailStoreEmployeesRouter);
// app.use(`/api/${floraApiVersion}/stores`, retailStoresRouter);
// app.use(`/api/${floraApiVersion}/strains`, retailStrainsRouter);
// app.use(`/api/${floraApiVersion}/send/sms`, sendSmsRouter);

// app.use("/api/${floraApiVersion}/seaplane", seaPlaneRouter);

app.use(
  responseTime((req: Request, res: Response, time) => {
    if (req.url) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.url,
          status_code: res.statusCode,
        },
        time * 1000,
      );
    }
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Found It!");
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: "Sorry can't find that!" });
});

// app.use((err: Error, req: Request, res: Response) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something broke -> ${err.message}" });
// });

export const restResponseTimeHistogram = new PrometheusClient.Histogram({
  name: "rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
});

export const databaseResponseTimeHistogram = new PrometheusClient.Histogram({
  name: "db_response_time_duration_seconds",
  help: "Database response time in seconds",
  labelNames: ["operation", "success"],
});

export const seaplaneFailCounter = new PrometheusClient.Counter({
  name: "http_requests_seaplane_fail_total",
  help: "seaplane_fail_counter_help",
  labelNames: ["status_code"],
});

export const seaplaneCounter = new PrometheusClient.Counter({
  name: "http_requests_seaplane_total",
  help: "seaplane_counter_help",
  labelNames: ["status_code"],
});

const promRegistry = new PrometheusClient.Registry();
PrometheusClient.collectDefaultMetrics({ register: promRegistry });
promRegistry.registerMetric(restResponseTimeHistogram);
promRegistry.registerMetric(databaseResponseTimeHistogram);
promRegistry.registerMetric(seaplaneFailCounter);
promRegistry.registerMetric(seaplaneCounter);

export const getPromRegistry = () => promRegistry;

app.listen(PORT, () => {
  return console.info(
    `🏃‍♂️🏃‍♀️Flora Node app started and is listening on port:${PORT}`,
  );
});

const isProduction = process.env.NODE_ENV === "production";
(async () => {
  try {
    await (await floraSequelize).sync({ force: true, logging: isProduction });
    console.info("🌿🌿 Flora Database synchronized successfully.🌿🌿");

    await redisService.createAndConnect();
  } catch (error) {
    console.error("🔴 Unable to connect to the database:", error);
  }
  try {
    await redisService.getClient();
    const storesHashExists = await redisService.client.exists(
      process.env.REDIS_KEY_STORES,
    );
    const chainsHashExists = await redisService.client.exists(
      process.env.REDIS_KEY_CHAINS,
    );
    if (!storesHashExists) {
      await redisService.setEmptyHashWithTTL(
        process.env.REDIS_KEY_STORES as string,
        parseInt(process.env.REDIS_TTL_IN_SECONDS as string),
      );
    }
    if (!chainsHashExists) {
      await redisService.setEmptyHashWithTTL(
        process.env.REDIS_KEY_CHAINS as string,
        parseInt(process.env.REDIS_TTL_IN_SECONDS as string),
      );
    }
  } catch (error) {
    console.error("🔴 Unable to connect to redis service:", error);
  }
})();
