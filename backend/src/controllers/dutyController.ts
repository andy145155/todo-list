import { Request, Response, NextFunction } from "express";
import {
  getDuties,
  createDuty,
  updateDuty,
  deleteDuty,
} from "../services/dutyServices";
import { Pool } from "pg";
import { AppError } from "../utils/AppError";

export const getAllDuties = (pool: Pool) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const duties = await getDuties(pool);
      res.json(duties);
    } catch (error) {
      next(error);
    }
  };
};

export const createNewDuty = (pool: Pool) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const duty = await createDuty(pool, req.body);
      res.status(201).json(duty);
    } catch (error) {
      next(error);
    }
  };
};

export const updateDutyById = (pool: Pool) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const duty = await updateDuty(pool, id, req.body);

      if (!duty) {
        return res
          .status(404)
          .json({ status: "fail", message: "Duty not found" });
      }

      res.json(duty);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        // Handle AppError with 404 status explicitly
        res.status(404).json({ status: "fail", message: error.message });
      } else {
        next(error); // Pass any other errors to the global error handler (500)
      }
    }
  };
};

export const deleteDutyById = (pool: Pool) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await deleteDuty(pool, id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Duty not found" });
      }
    } catch (error) {
      next(error);
    }
  };
};
