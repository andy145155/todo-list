import { Pool } from "pg";

const POSTGRES_HOST = process.env.POSTGRES_HOST || "db";
const POSTGRES_DB = process.env.POSTGRES_DB || "tododb";
const POSTGRES_USER = process.env.POSTGRES_USER || "postgres";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: 5432,
});

export default pool;
