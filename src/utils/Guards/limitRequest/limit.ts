import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request | any) => req.clientIP,
  handler: (_req: Request | any, res: Response) => {
    res.status(429).json({ code: 429, status: "Too Many Requests", message: "Too many requests from this IP, please try again after an 7 min", });
  },
});
