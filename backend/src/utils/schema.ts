import { z } from "zod";

export const dutySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z
    .union([z.date(), z.string().datetime()])
    .transform((i) => new Date(i)),
});

export const dutyArraySchema = z.array(dutySchema);

export type Duty = z.infer<typeof dutySchema>;

// Create schema represents the shape of the data that we expect to receive from the client
export const dutyCreateSchema = z.object({
  name: z.string().min(1).max(255, "Name cannot be longer than 255 characters"),
});

export type DutyCreate = z.infer<typeof dutyCreateSchema>;
