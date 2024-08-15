import { Router } from "express";
import {
  getAllDuties,
  createNewDuty,
  updateDutyById,
  deleteDutyById,
} from "../controllers/dutyController";

const router = Router();

router.get("/duties", getAllDuties);
router.post("/duties", createNewDuty);
router.put("/duties/:id", updateDutyById);
router.delete("/duties/:id", deleteDutyById);

export default router;
