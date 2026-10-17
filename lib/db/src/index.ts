import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Cargar .env de forma segura antes de inicializar la conexión
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "artifacts/api-server/.env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../artifacts/api-server/.env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch {}
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL no está definida en las variables de entorno.");
}

const isNeon = connectionString.includes("neon.tech");
console.log("🔌 Conectando base de datos a:", isNeon ? "Neon Cloud ☁️" : "Localhost 💻");

export const pool = new Pool({
  connectionString,
  ssl: isNeon ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export * from "./schema";