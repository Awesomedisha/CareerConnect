import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from "../errors/index.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};