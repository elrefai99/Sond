import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
     definition: {
          openapi: "3.0.0",
          info: {
               title: "My API Docs",
               version: "1.0.0",
               description: "API documentation for my project",
          },
          servers: [
               {
                    url: "http://localhost:9000/",
                    description: "Local URL",
               },
          ],
     },
     apis: ["./src/swagger/*.ts", "./dist/swagger/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
     console.log("📄 Swagger docs available at:", process.env.NODE_ENV === "development" ? `${String(process.env.SITE_API_Local_URL)}/api-docs` : `${String(process.env.SITE_API_URL)}/api-docs`);
}
