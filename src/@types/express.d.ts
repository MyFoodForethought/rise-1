// src/@types/express.d.ts
import { Request } from 'express';
import { ITokenPayload } from '@/middlewares/authMiddleware';

declare global {
  namespace Express {
    interface Request {
      user?:  ITokenPayload; // Add any additional properties you need
    }
  }
}
