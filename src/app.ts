import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import pino from "pino";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import health from "./routes/health";
import { notFound, errorHandler } from "./middlewares/error";

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
    windowMs: 60_000, // 1 menit
    max: 120,         // 120 req/menit/ip
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// routes
app.use(health);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
