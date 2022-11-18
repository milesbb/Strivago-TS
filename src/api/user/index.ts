import express, { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware, UserRequest } from "../../lib/auth/jwtAuth.js";
import {
  createTokens,
  verifyRefreshAndCreateNewTokens,
} from "../../lib/auth/tools.js";
import UsersModel from "./model.js";
import AccommodationsModel from "../accommodation/model.js";
import { checkUsersSchema, checkValidationResult } from "./validation.js";
import { User } from "./types.js";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const usersRouter = express.Router();

// GET MY ACCOMMODATIONS (HOST ONLY)

usersRouter.get(
  "/me/accommodations",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const accommodations = await AccommodationsModel.find({
        host: req.user!._id,
      }).populate({ path: "host", select: "email" });

      if (accommodations) {
        res.send(accommodations);
      } else {
        next(
          createHttpError(
            404,
            `No accommodations hosted by user ${req.user!._id} were found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// REGISTER USER (ANY)

usersRouter.post(
  "/register",
  checkUsersSchema,
  checkValidationResult,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();

      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

// LOGIN (ANY)

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user1 = await UsersModel.checkCredentials(email, password);

    if (user1) {
      const { accessToken, refreshToken } = await createTokens(user1);
      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, `Credentials are not ok!`));
    }
  } catch (error) {
    next(error);
  }
});

// REFRESH TOKEN (ANY)

usersRouter.post("/refreshTokens", async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body;
    const newTokens = await verifyRefreshAndCreateNewTokens(
      currentRefreshToken,
      next
    )!;

    res.send({ ...newTokens });
  } catch (error) {
    next(error);
  }
});

// GET ME

usersRouter.get(
  "/me",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const users = await UsersModel.findById(req.user?._id);
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

// GET

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
