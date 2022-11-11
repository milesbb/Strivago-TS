import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header"
      )
    );
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");
      const payload = await verifyAccessToken(accessToken);
      req.user = {
        _id: payload._id,
        role: payload.role,
      };

      const requestOptions = { baseUrl: req.originalUrl, method: req.method };

      const hostOnlyEndpoints = [
        { baseUrl: "/user/me/accommodations", method: "GET" },
        { baseUrl: "/accommodations", method: "POST" },
        { baseUrl: "/accommodations/:id", method: "PUT" },
        { baseUrl: "/accommodations/:id", method: "DELETE" },
      ];

      if (hostOnlyEndpoints.includes(requestOptions)) {
        if (req.user.role === "Host") {
          next();
        } else {
          next(
            createHttpError(403, "Must be a host to access these endpoints!")
          );
        }
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
