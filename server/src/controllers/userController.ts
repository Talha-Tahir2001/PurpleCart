import type { Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { env } from "../configs/env.js";
import type { AuthenticatedRequest } from "../types/authenticatedRequest.js";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// Register User : /api/user/register
export const register = async (
  req: AuthenticatedRequest<RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.json({
        success: false,
        message: "Missing Details",
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.json({
        success: false,
        message: "User Already Exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id.toString() },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    console.error(message);

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// Login User : /api/user/login
export const login = async (
  req: AuthenticatedRequest<LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({
        success: false,
        message: "Email and Password are required",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.json({
        success: false,
        message: "Invalid Email or Password",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({
        success: false,
        message: "Invalid Email or Password",
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    console.error(message);

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    console.error(message);

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// Logout User : /api/user/logout
export const logout = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.json({
      success: true,
      message: "Logged Out!",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    console.error(message);

    res.status(500).json({
      success: false,
      message,
    });
  }
};