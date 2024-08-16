import {
  Duty,
  dutyArraySchema,
  DutyCreate,
  dutyCreateSchema,
  dutySchema,
} from "../utils/schema";
import { AppError } from "../utils/AppError";
import z from "zod";
import { Pool } from "pg";

const DB_TABLE = {
  DUTIES: "duties",
};

export const getDuties = async (pool: Pool): Promise<Duty[]> => {
  try {
    const { rows } = await pool.query(`SELECT * FROM ${DB_TABLE.DUTIES}`);

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

export const createDuty = async (
  pool: Pool,
  duty: DutyCreate,
): Promise<Duty> => {
  try {
    // Validate input before performing the operation
    const validatedDuty = dutyCreateSchema.parse(duty);

    const { rows } = await pool.query(
      `INSERT INTO ${DB_TABLE.DUTIES} (name) VALUES ($1) RETURNING *`,
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
  pool: Pool,
  id: number,
  duty: DutyCreate,
): Promise<Duty | null> => {
  try {
    const validatedDuty = dutyCreateSchema.parse(duty);

    const { rows } = await pool.query(
      `UPDATE ${DB_TABLE.DUTIES} SET name = $1 WHERE id = $2 RETURNING *`,
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
    } else if (error instanceof AppError) {
      throw error;
    } else if (error instanceof Error) {
      throw new AppError(`Unexpected error: ${error.message}`, 500);
    } else {
      throw new AppError("An unexpected error occurred", 500);
    }
  }
};

export const deleteDuty = async (pool: Pool, id: number): Promise<boolean> => {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM ${DB_TABLE.DUTIES} WHERE id = $1`,
      [id],
    );

    if (rowCount === 0) {
      throw new AppError("Duty not found", 404);
    }

    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(`Validation error: ${error.message}`, 400);
    } else if (error instanceof AppError) {
      throw error;
    } else if (error instanceof Error) {
      throw new AppError(`Unexpected error: ${error.message}`, 500);
    } else {
      throw new AppError("An unexpected error occurred", 500);
    }
  }
};
