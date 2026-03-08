import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from "../errors/index.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnAuthenticatedError("Authentication required. Please log in.");
  }

  try {
    if (token.startsWith('session_')) {
      req.user = { userId: token.split('_')[1], isGuest: true };
    } else {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      req.user = { userId: payload.userId };
    }

    next();
  } catch (error) {
    throw new UnAuthenticatedError("Your session has expired. Please log in again.");
  }
};