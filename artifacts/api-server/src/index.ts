import fs from "fs";
import path from "path";
import app from "./app";
import { logger } from "./lib/logger";

// Cargar variables de entorno desde .env si existe (Node 20+)
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../../.env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch {}
  }
}

// Fallback al puerto 5000 si no se define la variable PORT
const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});