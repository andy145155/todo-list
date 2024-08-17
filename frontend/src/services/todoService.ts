import axios from "axios";
import {
  dutyArraySchema,
  dutyCreateSchema,
  dutySchema,
  Duty,
  DutyCreate,
} from "../schema/duty";

// API_URL is the URL of the backend API. It is set to http://localhost:4000/api by default.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Create a reusable axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTodos = async (): Promise<Duty[]> => {
  try {
    const response = await apiClient.get("/duties");
    const duties = dutyArraySchema.parse(response.data);
    return duties;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw new Error("Error fetching todos");
  }
};

export const createTodo = async (name: string): Promise<Duty> => {
  try {
    const validatedDuty: DutyCreate = dutyCreateSchema.parse({ name });
    const response = await apiClient.post("/duties", validatedDuty);
    const createdDuty = dutySchema.parse(response.data);
    return createdDuty;
  } catch (error) {
    console.error("Failed to create todo:", error);
    throw new Error("Error creating todo");
  }
};

export const updateTodo = async (id: number, name: string): Promise<Duty> => {
  try {
    const validatedDuty: DutyCreate = dutyCreateSchema.parse({ name });
    const response = await apiClient.put(`/duties/${id}`, validatedDuty);
    const updatedDuty = dutySchema.parse(response.data);
    return updatedDuty;
  } catch (error) {
    console.error("Failed to update todo:", error);
    throw new Error("Error updating todo");
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/duties/${id}`);
  } catch (error) {
    console.error("Failed to delete todo:", error);
    throw new Error("Error deleting todo");
  }
};
