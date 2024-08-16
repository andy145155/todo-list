import express from "express";
import request from "supertest";
import { Pool } from "pg";
import { setupTestDB } from "./dbSetup";
import createApp from "../../src";

describe("Duty API Integration Tests", () => {
  let pool: Pool;
  let app: express.Application;

  beforeAll(async () => {
    pool = await setupTestDB();
    app = createApp(pool);
  });

  afterEach(async () => {
    await pool.query("DELETE FROM duties");
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Full CRUD flow", () => {
    it("should create, read, update, and delete a duty", async () => {
      const createResponse = await request(app)
        .post("/api/duties")
        .send({ name: "Test Duty" });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty("id");
      expect(createResponse.body.name).toBe("Test Duty");

      const dutyId = createResponse.body.id;

      // Read all duties
      const readAllResponse = await request(app).get("/api/duties");
      expect(readAllResponse.status).toBe(200);
      expect(readAllResponse.body).toHaveLength(1);
      expect(readAllResponse.body[0].id).toBe(dutyId);

      // Update the duty
      const updateResponse = await request(app)
        .put(`/api/duties/${dutyId}`)
        .send({ name: "Updated Test Duty" });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe("Updated Test Duty");

      // Delete the duty
      const deleteResponse = await request(app).delete(`/api/duties/${dutyId}`);
      expect(deleteResponse.status).toBe(204);

      // Verify duty is deleted
      const finalReadResponse = await request(app).get("/api/duties");
      expect(finalReadResponse.status).toBe(200);
      expect(finalReadResponse.body).toHaveLength(0);
    });
  });

  describe("Error handling", () => {
    it("should handle invalid input for create", async () => {
      const response = await request(app)
        .post("/api/duties")
        .send({ name: "" });
      expect(response.status).toBe(400);
    });

    it("should handle updating non-existent duty", async () => {
      const response = await request(app)
        .put("/api/duties/9999")
        .send({ name: "Non-existent Duty" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Duty not found");
    });

    it("should handle deleting non-existent duty", async () => {
      const response = await request(app).delete("/api/duties/9999");
      expect(response.status).toBe(404);
    });
  });

  describe("Edge cases", () => {
    it("should handle very long duty names", async () => {
      const longName = "a".repeat(256);
      const response = await request(app)
        .post("/api/duties")
        .send({ name: longName });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "Name cannot be longer than 255 characters",
      );
    });

    it("should handle concurrent requests", async () => {
      const requests = Array(10)
        .fill(null)
        .map(() =>
          request(app).post("/api/duties").send({ name: "Concurrent Duty" }),
        );
      const responses = await Promise.all(requests);
      expect(responses.every((res) => res.status === 201)).toBe(true);

      const readResponse = await request(app).get("/api/duties");
      expect(readResponse.body).toHaveLength(10);
    });
  });
});
