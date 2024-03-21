import {
  expect,
  jest,
  describe,
  it,
  beforeEach,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { faker } from "@faker-js/faker";
import mockSequelize, { closeConnection } from "./testUtils/mockSequelize";
import request from "supertest";
import mockRouter from "./testUtils/mockRouter";
import { Model, ModelCtor } from "sequelize-typescript/dist/model/model/model";
import propelAuth from "../src/utils/propelAuth";
import { Transaction } from "sequelize";

jest.mock("@propelauth/express", () => ({ initAuth: jest.fn() }));
jest.mock("../src/utils/propelAuth", () => ({
  createOrg: () => jest.fn(),
  deleteOrg: () => jest.fn(),
}));
jest.mock("../src/utils/redisService", () => ({
  getClient: () => ({ hSet: () => jest.fn() }),
}));

const testChain = {
  name: faker.company.name().toLowerCase(),
  address: faker.location.streetAddress(),
  phone: faker.phone.number(),
  logo: faker.image.url(),
  createdBy: 0,
  updatedBy: 0,
};

describe("Tests Chain model endpoint functions", () => {
  let chainModel: ModelCtor<Model<any, any>>;

  beforeAll(() => {
    const { Chains } = mockSequelize.models;
    chainModel = Chains as ModelCtor<Model<any, any>>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    closeConnection(mockSequelize);
  });

  it("Should successfully create a new chain", async () => {
    jest.spyOn(chainModel, "create").mockResolvedValueOnce({
      ...testChain,
    });

    jest.spyOn(chainModel, "findOne").mockResolvedValue(null);

    jest
      .spyOn(mockSequelize, "transaction")
      .mockResolvedValueOnce(true as unknown as Transaction);

    jest.spyOn(propelAuth, "createOrg").mockResolvedValueOnce({
      name: faker.company.name(),
      orgId: faker.string.uuid(),
    });

    const resp = await request(mockRouter)
      .post("/api/chains")
      .send(testChain)
      .set("x-api-key", process.env.SERVICE_API_KEY || "");

    expect(resp.statusCode).toBe(200);
    expect(mockSequelize.models.Chains.create).toHaveBeenCalled();
    expect(resp.body).toEqual(testChain);
  });

  it("Should handle createChain failures appropriately", async () => {
    const caseOne = { ...testChain };
    const caseTwo = { ...testChain, name: undefined };
    const caseThree = undefined;

    const zodErrorMsg = {
      message: {
        issues: [
          {
            code: "invalid_type",
            expected: "string",
            message: "Required",
            path: ["name"],
            received: "undefined",
          },
        ],
        name: "ZodError",
      },
    };

    const errMsg = "Something happened!";
    jest.spyOn(chainModel, "create").mockRejectedValue(new Error(errMsg));

    jest.spyOn(chainModel, "findOne").mockResolvedValue(null);

    jest
      .spyOn(mockSequelize, "transaction")
      .mockResolvedValueOnce(true as unknown as Transaction);

    jest.spyOn(propelAuth, "createOrg").mockResolvedValueOnce({
      name: faker.company.name(),
      orgId: faker.string.uuid(),
    });

    jest.spyOn(propelAuth, "deleteOrg").mockResolvedValueOnce(true);

    let resp = await request(mockRouter)
      .post("/api/chains")
      .send(caseOne)
      .set("x-api-key", process.env.SERVICE_API_KEY || "");

    expect(resp.statusCode).toBe(500);
    expect(resp.body).toEqual({ message: errMsg });

    resp = await request(mockRouter)
      .post("/api/chains")
      .send(caseTwo)
      .set("x-api-key", process.env.SERVICE_API_KEY || "");

    expect(resp.statusCode).toBe(400);
    expect(resp.body).toEqual(zodErrorMsg);

    resp = await request(mockRouter)
      .post("/api/chains")
      .send(caseThree)
      .set("x-api-key", process.env.SERVICE_API_KEY || "");

    expect(resp.statusCode).toBe(400);
    expect(resp.body).toEqual({ message: "Content can not be empty!" });
  });
});
