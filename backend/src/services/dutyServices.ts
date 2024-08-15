import pool from "../utils/db";
import {
  Duty,
  dutyArraySchema,
  DutyCreate,
  dutyCreateSchema,
  dutySchema,
} from "../utils/schema";
import { DB_TABLE } from "../utils/constant";
import { AppError } from "../utils/AppError";
import z from "zod";

export const getDuties = async (): Promise<Duty[]> => {
  const { rows } = await pool.query(`SELECT * FROM ${DB_TABLE.DUTIES}`);

  try {
    const duties = dutyArraySchema.parse(rows);
    return duties;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(`Validation error: ${error.message}`, 400);
    } else if (error instanceof Error) {
      // General error
      throw new AppError(`Unexpected error: ${error.message}`, 500);
    } else {
      // Fallback for unknown error types
      throw new AppError("An unexpected error occurred", 500);
    }
  }
};

export const createDuty = async (duty: DutyCreate): Promise<Duty> => {
  try {
    // Validate input before performing the operation
    const validatedDuty = dutyCreateSchema.parse(duty);

    const { rows } = await pool.query(
      "INSERT INTO duties (name) VALUES ($1) RETURNING *",
      [validatedDuty.name],
    );

    const createdDuty = dutySchema.parse(rows[0]);

    return createdDuty;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(`Validation error: ${error.message}`, 400);
    } else if (error instanceof Error) {
      throw new AppError(`Unexpected error: ${error.message}`, 500);
    } else {
      throw new AppError("An unexpected error occurred", 500);
    }
  }
};

export const updateDuty = async (
  id: number,
  duty: DutyCreate,
): Promise<Duty | null> => {
  try {
    const validatedDuty = dutyCreateSchema.parse(duty);

    const { rows } = await pool.query(
      "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
      [validatedDuty.name, id],
    );

    if (rows.length === 0) {
      throw new AppError("Duty not found", 404);
    }

    const updatedDuty = dutySchema.parse(rows[0]);
    return updatedDuty;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(`Validation error: ${error.message}`, 400);
    } else if (error instanceof Error) {
      throw new AppError(`Unexpected error: ${error.message}`, 500);
    } else {
      throw new AppError("An unexpected error occurred", 500);
    }
  }
};

export const deleteDuty = async (id: number): Promise<boolean> => {
  try {
    const { rowCount } = await pool.query("DELETE FROM duties WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      throw new AppError("Duty not found", 404);
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(`Unexpected error: ${error.message}`, 500);
    } else {
      throw new AppError("An unexpected error occurred", 500);
    }
  }
};
