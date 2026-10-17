import { defineConfig } from "drizzle-kit";
import path from "path";
import fs from "fs";

// Cargar .env de lib/db o de la raíz del proyecto si existe
const envPaths = [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch {}
  }
}

// Usar la variable de entorno o tu conexión local de Docker en el puerto 5433
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/fortuna_db";

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});