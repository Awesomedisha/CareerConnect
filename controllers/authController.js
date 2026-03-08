import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/api-errors.js';
import xssFilters from 'xss-filters';
import { saveUser, findUserByEmail } from '../utils/userStorage.js';

const oneDay = 1000 * 60 * 60 * 24;

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const userAlreadyExists = await findUserByEmail(email);
  if (userAlreadyExists) {
    throw new BadRequestError(`The email: ${email} is already in use.`);
  }

  const user = await saveUser({ name, email, password, role });
  // token logic needs to handle both Mongoose models and plain JSON objects
  const token = (user && user.createToken) ? user.createToken() : 'temp-token-for-%SERVER%';

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.CREATED).json({
    user: user ? {
      email: user.email,
      lastName: user.lastName || '',
      location: user.location || '',
      name: user.name
    } : { name, email },
    location: user ? (user.location || '') : '',
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  // Support both Mongoose models (comparePassword) and raw objects (direct comparison)
  let isPasswordCorrect = false;
  if (user.comparePassword) {
    isPasswordCorrect = await user.comparePassword(password);
  } else {
    isPasswordCorrect = (password === user.password);
  }

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = (user && user.createToken) ? user.createToken() : 'temp-token-for-%SERVER%';
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  // Handle Mongoose vs Plain object
  const userResponse = user.toObject ? user.toObject() : { ...user };
  delete userResponse.password;

  res.status(StatusCodes.OK).json({
    user: userResponse,
    location: user.location || ''
  });
};

export const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Please provide essential values (name, email)");
  }

  // Update only works for MongoDB currently, or we'd need to update the JSON
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new UnAuthenticatedError("Update not supported for JSON-only users currently");
  }

  user.email = email;
  user.name = xssFilters.inHTMLData(name);

  const fields = ['firstName', 'lastName', 'fullName', 'phone', 'location', 'city', 'state', 'country', 'profilePicture', 'headline', 'bio'];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = xssFilters.inHTMLData(String(req.body[field]));
    }
  });

  await user.save();

  const token = user.createToken();
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.OK).json({
    user,
    location: user.location
  });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    // Try JSON fallback for current user if userId matches
    const fallbackUser = await findUserByEmail(req.user.email); // Need to add email to payload if we want this
    if (!fallbackUser) throw new UnAuthenticatedError("User not found");
    res.status(StatusCodes.OK).json({ user: fallbackUser, location: '' });
    return;
  }
  res.status(StatusCodes.OK).json({
    user,
    location: user.location
  });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({
    msg: 'User logged out!'
  });
};
