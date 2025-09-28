import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../config/env.js";

const version = process.env.npm_package_version ?? "0.1.0";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Docs",
      version,
      description: "REST API documentation"
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: "Local" }
      // Tambah base URL prod di sini
      // { url: "https://api.example.com", description: "Prod" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    }
  },
  apis: ["./src/routes/**/*.ts"], // path file untuk JSDoc
});
