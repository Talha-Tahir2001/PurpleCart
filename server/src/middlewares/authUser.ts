import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../configs/env.js";
import type { AuthenticatedRequest } from "../types/authenticatedRequest.js";

interface UserTokenPayload extends jwt.JwtPayload {
  id: string;
}

const authUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const { userToken } = req.cookies;

  if (!userToken) {
    res.json({
      success: false,
      message: "Not Authorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      userToken,
      env.JWT_SECRET
    ) as UserTokenPayload;

    if (!decoded.id) {
      res.json({
        success: false,
        message: "Not Authorized",
      });
      return;
    }

    req.userId = decoded.id;

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export default authUser;