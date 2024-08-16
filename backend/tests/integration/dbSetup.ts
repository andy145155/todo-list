import { newDb } from "pg-mem";
import { Pool } from "pg";

// Function to setup the in-memory PostgreSQL database
export const setupTestDB = async (): Promise<any> => {
  const db = newDb();
  const pg = db.adapters.createPg();
  const pool = new pg.Pool();

  const queryText = `
  CREATE TABLE duties (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
  await pool.query(queryText);

  return pool;
};
