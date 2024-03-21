import { expect, jest, describe, it, beforeEach } from "@jest/globals";
import mockSequelize from "./testUtils/mockSequelize";

describe("Mock the sequelize instance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should authenticate to the DB appropriatatly", async () => {
    jest.spyOn(mockSequelize, "authenticate").mockResolvedValueOnce();

    const result = await mockSequelize.authenticate();

    expect(mockSequelize.authenticate).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("Should handle authentication failure", async () => {
    const errorMessage = "Authentication failed";
    jest
      .spyOn(mockSequelize, "authenticate")
      .mockRejectedValueOnce(new Error(errorMessage));

    await expect(mockSequelize.authenticate()).rejects.toThrowError(
      errorMessage,
    );
    expect(mockSequelize.authenticate).toHaveBeenCalled();
  });
});
