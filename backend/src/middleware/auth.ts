import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Export the interface so it can be imported in other files
export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
    // Add other user properties you need
  };
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findOne({ _id: (decoded as any)._id });

    if (!user) {
      throw new Error();
    }

    // Transform the MongoDB document to match our type definition
    req.user = {
      _id: (user as any)._id.toString(),
      role: user.role
      // Add other properties you need
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Please authenticate." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied." });
    }

    // Make sure to add a return statement at the end
    return next();
  };
};