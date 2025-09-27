import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  // log port saat start
  // gunakan proses manager (pm2/systemd) di production
  console.log(`Server listening on http://localhost:${env.PORT}`);
});

process.on("SIGINT", () => server.close());
process.on("SIGTERM", () => server.close());
