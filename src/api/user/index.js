import express from "express";
import createHttpError from "http-errors";
import {
  createTokens,
  verifyRefreshAndCreateNewTokens,
} from "../../lib/auth/tools.js";
import UsersModel from "./model.js";
import { checkUsersSchema, checkValidationResult } from "./validation.js";

const usersRouter = express.Router();

// REGISTER USER

usersRouter.post(
  "/register",
  checkUsersSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();

      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

// LOGIN

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const { accessToken, refreshToken } = await createTokens(user);
      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(401, `Credentials are not ok!`));
    }
  } catch (error) {
    next(error);
  }
});

// REFRESH TOKEN

usersRouter.post("/refreshTokens", async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body;

    const { accessToken, refreshToken } = await verifyRefreshAndCreateNewTokens(
      currentRefreshToken
    );

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

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
