import { Pool } from "pg";

const ssl =
  process.env.DB_SSL === "true"
    ? { rejectUnauthorized: true } // gunakan CA chain di prod jika perlu
    : false;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl,
  min: Number(process.env.DB_POOL_MIN ?? 1),
  max: Number(process.env.DB_POOL_MAX ?? 10),
  connectionTimeoutMillis: Number(process.env.DB_CONN_TIMEOUT_MS ?? 5000),
  idleTimeoutMillis: 30000,
});

export async function healthCheck() {
  const { rows } = await pool.query("select 1 as ok");
  return rows[0]?.ok === 1;
}

// graceful shutdown
export function setupDbShutdownSignals(server: import("http").Server) {
  const close = async () => {
    await pool.end();
    server.close();
  };
  process.on("SIGINT", close);
  process.on("SIGTERM", close);
}
