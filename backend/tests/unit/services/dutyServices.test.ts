import {
  getDuties,
  createDuty,
  updateDuty,
  deleteDuty,
} from "../../../src/services/dutyServices";
import pool from "../../../src/utils/db";

// Mock the pool to prevent actual DB queries
jest.mock("../../../src/utils/db");

describe("Duty Services", () => {
  afterEach(() => {
    // Clear mocks after each test to avoid side effects
    jest.clearAllMocks();
  });

  describe("getDuties", () => {
    it("should return a list of duties", async () => {
      const mockDuties = [
        {
          id: 1,
          name: "Test Duty",
          createdAt: new Date("2024-08-01T00:00:00.000Z"),
        },
      ];
      // Mock the pool.query call to return the mockDuties
      (pool.query as jest.Mock).mockResolvedValue({ rows: mockDuties });

      const duties = await getDuties();
      expect(duties).toEqual(mockDuties);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM duties");
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(getDuties()).rejects.toThrow("Database error");
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM duties");
    });
  });

  describe("createDuty", () => {
    it("should create a new duty and return it", async () => {
      const newDuty = {
        id: 1,
        name: "New Duty",
        createdAt: new Date("2024-08-01T00:00:00.000Z"),
      };
      (pool.query as jest.Mock).mockResolvedValue({ rows: [newDuty] });

      const duty = await createDuty({ name: "New Duty" });
      expect(duty).toEqual(newDuty);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO duties (name) VALUES ($1) RETURNING *",
        ["New Duty"],
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("Insert error"));

      await expect(createDuty({ name: "New Duty" })).rejects.toThrow(
        "Insert error",
      );
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO duties (name) VALUES ($1) RETURNING *",
        ["New Duty"],
      );
    });
  });

  describe("updateDuty", () => {
    it("should update a duty if it exists", async () => {
      const updatedDuty = {
        id: 1,
        name: "Updated Duty",
        createdAt: new Date("2024-08-01T00:00:00.000Z"),
      };
      (pool.query as jest.Mock).mockResolvedValue({ rows: [updatedDuty] });

      const duty = await updateDuty(1, { name: "Updated Duty" });
      expect(duty).toEqual(updatedDuty);
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
        ["Updated Duty", 1],
      );
    });

    it("should throw an error if the duty does not exist", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      await expect(updateDuty(1, { name: "Updated Duty" })).rejects.toThrow(
        "Unexpected error: Duty not found",
      );
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
        ["Updated Duty", 1],
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("Update error"));

      await expect(updateDuty(1, { name: "Updated Duty" })).rejects.toThrow(
        "Update error",
      );
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
        ["Updated Duty", 1],
      );
    });
  });

  describe("deleteDuty", () => {
    it("should return true if the duty was deleted", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const success = await deleteDuty(1);
      expect(success).toBe(true);
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM duties WHERE id = $1",
        [1],
      );
    });

    it("should throw an error if the duty does not exist", async () => {
      // Mock the pool.query to return an empty result (i.e., no rows deleted)
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      // Ensure the function throws an error when the duty is not found
      await expect(deleteDuty(1)).rejects.toThrow("Duty not found");

      // Ensure the query was called with the correct values
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM duties WHERE id = $1",
        [1],
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("Delete error"));

      await expect(deleteDuty(1)).rejects.toThrow("Delete error");
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM duties WHERE id = $1",
        [1],
      );
    });
  });
});
