// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../@types/user'; 


export type ITokenPayload = { id:number,email:string}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return; // Make sure to return after sending a response
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return; // Ensure to return after sending a response
    }

    // Cast decoded to the User interface
    req.user = decoded as ITokenPayload; 
    next(); // Proceed to the next middleware or route handler
  });
};

export default authMiddleware;
