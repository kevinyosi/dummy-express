import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import pino from "pino";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import health from "./routes/health.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith("/docs"), // jangan rate-limit halaman docs
  })
);

// ===== Swagger UI =====
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Routes =====
app.use(health);

export default app;
