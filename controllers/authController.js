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
  const token = user ? user.createToken() : 'temp-token'; // Fallback token if only JSON saved

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.CREATED).json({
    user: user ? {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name
    } : { name, email },
    location: user ? user.location : 'local',
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

  // Support both Mongoose models and raw objects
  const isPasswordCorrect = user.comparePassword ? await user.comparePassword(password) : (password === user.password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createToken ? user.createToken() : 'temp-token';
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  if (user.toObject) {
    const userObj = user.toObject();
    delete userObj.password;
    res.status(StatusCodes.OK).json({ user: userObj, location: user.location });
  } else {
    delete user.password;
    res.status(StatusCodes.OK).json({ user, location: user.location });
  }
};

export const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Please provide essential values (name, email)");
  }

  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new UnAuthenticatedError("User not found");
  }

  user.email = email;
  user.name = xssFilters.inHTMLData(name);

  // Apply other fields...
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
    throw new UnAuthenticatedError("User not found");
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
