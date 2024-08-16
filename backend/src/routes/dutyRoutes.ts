import { Router } from "express";
import {
  getAllDuties,
  createNewDuty,
  updateDutyById,
  deleteDutyById,
} from "../controllers/dutyController";
import { Pool } from "pg";

const dutyRoutes = (pool: Pool) => {
  const router = Router();

  router.get("/duties", getAllDuties(pool));
  router.post("/duties", createNewDuty(pool));
  router.put("/duties/:id", updateDutyById(pool));
  router.delete("/duties/:id", deleteDutyById(pool));

  return router;
};

export default dutyRoutes;
