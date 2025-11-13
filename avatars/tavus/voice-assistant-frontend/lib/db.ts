/**
 * Database connection utility for Next.js API routes
 * Uses node-postgres (pg) to connect to Neon PostgreSQL
 */

import { Pool, QueryResult } from "pg";

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("neon.tech")
    ? {
        rejectUnauthorized: false, // Required for Neon
      }
    : undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

/**
 * Execute a query and return results
 */
export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error", { text, error });
    throw error;
  }
}

/**
 * Get a single client from the pool (for transactions)
 */
export async function getClient() {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout to prevent hanging connections
  const timeout = setTimeout(() => {
    console.error("A client has been checked out for more than 5 seconds!");
  }, 5000);
  
  // Override client.query to log queries
  client.query = (...args: any[]) => {
    client.lastQuery = args;
    return query(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    return release();
  };
  
  return client;
}

export default pool;

