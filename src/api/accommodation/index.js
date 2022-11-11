import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import AccommodationsModel from "./model.js";
import {
  checkAccommodationSchema,
  checkValidationResult,
} from "./validation.js";

const accommodationsRouter = express.Router();

// GET ALL (BOTH)

accommodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// GET SPECIFIC (BOTH)

accommodationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// POST ACCOMMODATION (HOST ONLY)

accommodationsRouter.get(
  "/:id",
  JWTAuthMiddleware,
  checkAccommodationSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

// EDIT ACCOMMODATION (HOST ONLY)

accommodationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// DELETE ACCOMMODATION (HOST ONLY)

accommodationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default accommodationsRouter;
