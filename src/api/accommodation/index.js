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
    const accommodations = await AccommodationsModel.find();

    res.status(200).send(accommodations);
  } catch (error) {
    next(error);
  }
});

// GET SPECIFIC (BOTH)

accommodationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodation = await AccommodationsModel.findById(req.params.id);

    if (accommodation) {
      res.status(200).send(accommodation);
    } else {
      next(
        createHttpError(
          404,
          `No accommodation with id ${req.params.id} was found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// POST ACCOMMODATION (HOST ONLY)

accommodationsRouter.post(
  "/",
  JWTAuthMiddleware,
  checkAccommodationSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newAccommodation = new AccommodationsModel(req.body);
      const { _id } = await newAccommodation.save();

      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

// EDIT ACCOMMODATION (HOST ONLY)

accommodationsRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// DELETE ACCOMMODATION (HOST ONLY)

accommodationsRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

export default accommodationsRouter;
