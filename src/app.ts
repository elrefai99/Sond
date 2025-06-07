process
     .on("unhandledRejection", (reason, p) => {
          console.error(reason, "Unhandled Rejection at Promise", p);
     })
     .on("uncaughtException", (err) => {
          console.error(err, "Uncaught Exception thrown");
          console.log("LOL");
          process.exit(1);
     });
import "reflect-metadata"
import 'dotenv/config'
import express, { Request, Response } from 'express'
import siteUtils from './utils/site.utils'
import client from "prom-client";
import * as http from 'node:http'
import { Server as SocketIOServer } from 'socket.io'
import { setupSwagger } from "./swagger";

const app = express()

const server = http.createServer(app)
export const ioSocket = new SocketIOServer(server, {
     cors: {
          origin: "*"
     }
})

siteUtils(app)
setupSwagger(app);

app.get('/metrics', async (_req, res: Response) => {
     res.set('Content-Type', client.register.contentType);
     res.end(await client.register.metrics());
});

app.use(async (_req: Request, res: Response) => {
     res.status(404).send('This is not the API route you are looking for')
})
const port: number = Number(process.env.PORT)
server.listen(port, () => {
     console.log("🌐 Server is running on:", process.env.NODE_ENV === "development" ? String(process.env.SITE_API_Local_URL) : String(process.env.SITE_API_URL))
})
