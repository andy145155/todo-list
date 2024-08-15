import { Request, Response, NextFunction } from "express";
import {
  getDuties,
  createDuty,
  updateDuty,
  deleteDuty,
} from "../services/dutyServices";

export const getAllDuties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const duties = await getDuties();
    res.json(duties);
  } catch (error) {
    next(error);
  }
};

export const createNewDuty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const duty = await createDuty(req.body);
    res.status(201).json(duty);
  } catch (error) {
    next(error);
  }
};

export const updateDutyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const duty = await updateDuty(id, req.body);
    if (duty) {
      res.json(duty);
    } else {
      res.status(404).json({ message: "Duty not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteDutyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await deleteDuty(id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Duty not found" });
    }
  } catch (error) {
    next(error);
  }
};
