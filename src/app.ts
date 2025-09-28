import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import pino from "pino";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

import health from "./routes/health.js";
import dbRouter from "./routes/db.js";

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

app.set("trust proxy", 1);
app.use(pinoHttp({ logger }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: false }));
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/], credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// Swagger
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limit (skip docs)
app.use(rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith("/docs"),
}));

// API v1
const api = express.Router();
api.use(health);
api.use(dbRouter);
app.use("/api", api);

// 404 + error
app.use((req, res) => res.status(404).json({ error: "Not Found" }));
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(500).json({ error: message });
});

export default app;
