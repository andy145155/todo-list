import express from "express";
import request from "supertest";
import * as dutyService from "../../../src/services/dutyServices";
import {
  getAllDuties,
  createNewDuty,
  updateDutyById,
  deleteDutyById,
} from "../../../src/controllers/dutyController";

jest.mock("../../../src/services/dutyServices");

const app = express();
app.use(express.json());

app.get("/duties", getAllDuties);
app.post("/duties", createNewDuty);
app.put("/duties/:id", updateDutyById);
app.delete("/duties/:id", deleteDutyById);

describe("Duty Controller", () => {
  describe("GET /duties", () => {
    it("should return a list of duties", async () => {
      const mockDuties = [
        {
          id: 1,
          name: "Test Duty",
          createdAt: new Date("2024-08-01T00:00:00.000Z"),
        },
      ];
      jest.spyOn(dutyService, "getDuties").mockResolvedValue(mockDuties);

      const response = await request(app).get("/duties");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          name: "Test Duty",
          createdAt: "2024-08-01T00:00:00.000Z",
        },
      ]);
    });

    it("should handle errors in getAllDuties", async () => {
      jest
        .spyOn(dutyService, "getDuties")
        .mockRejectedValue(new Error("Something went wrong"));

      const response = await request(app).get("/duties");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /duties", () => {
    it("should create a new duty", async () => {
      const newDuty = {
        id: 1,
        name: "New Duty",
        createdAt: new Date("2024-08-01T00:00:00.000Z"),
      };
      jest.spyOn(dutyService, "createDuty").mockResolvedValue(newDuty);

      const response = await request(app)
        .post("/duties")
        .send({ name: "New Duty" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        name: "New Duty",
        createdAt: "2024-08-01T00:00:00.000Z",
      });
    });

    it("should handle errors in createNewDuty", async () => {
      jest
        .spyOn(dutyService, "createDuty")
        .mockRejectedValue(new Error("Create error"));

      const response = await request(app)
        .post("/duties")
        .send({ name: "New Duty" });

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /duties/:id", () => {
    it("should update a duty if it exists", async () => {
      const updatedDuty = {
        id: 1,
        name: "Updated Duty",
        createdAt: new Date("2024-08-01T00:00:00.000Z"),
      };
      jest.spyOn(dutyService, "updateDuty").mockResolvedValue(updatedDuty);

      const response = await request(app)
        .put("/duties/1")
        .send({ name: "Updated Duty" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: "Updated Duty",
        createdAt: "2024-08-01T00:00:00.000Z",
      });
    });

    it("should return 404 if duty is not found", async () => {
      jest.spyOn(dutyService, "updateDuty").mockResolvedValue(null);

      const response = await request(app)
        .put("/duties/1")
        .send({ name: "Updated Duty" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Duty not found");
    });

    it("should handle errors in updateDutyById", async () => {
      jest
        .spyOn(dutyService, "updateDuty")
        .mockRejectedValue(new Error("Update error"));

      const response = await request(app)
        .put("/duties/1")
        .send({ name: "Updated Duty" });

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /duties/:id", () => {
    it("should delete a duty if it exists", async () => {
      jest.spyOn(dutyService, "deleteDuty").mockResolvedValue(true);

      const response = await request(app).delete("/duties/1");

      expect(response.status).toBe(204); // No content
    });

    it("should return 404 if duty is not found", async () => {
      jest.spyOn(dutyService, "deleteDuty").mockResolvedValue(false);

      const response = await request(app).delete("/duties/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Duty not found");
    });

    it("should handle errors in deleteDutyById", async () => {
      jest
        .spyOn(dutyService, "deleteDuty")
        .mockRejectedValue(new Error("Delete error"));

      const response = await request(app).delete("/duties/1");

      expect(response.status).toBe(500);
    });
  });
});
