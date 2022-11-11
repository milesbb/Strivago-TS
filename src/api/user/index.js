import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js"

const usersRouter = express.Router()

export default usersRouter