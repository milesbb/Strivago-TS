import express from "express";
import createHttpError from "http-errors";
import AccommodationsModel from "./model.js"

const accommodationsRouter = express.Router()

export default accommodationsRouter