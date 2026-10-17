import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import cors from "cors";

//CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://thefortunaconnect.com",
  "https://www.thefortunaconnect.com",
  "https://admin.thefortunaconnect.com",
];


const app: Express = express();

// Asegurar que la carpeta uploads exista para que multer no falle
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ id: req.id, method: req.method, url: req.url?.split("?")[0] }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir herramientas como Postman o mismo origen
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado por política CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del CV
app.use("/uploads", express.static(uploadsDir));

app.use("/api", router);

export default app;