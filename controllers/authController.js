import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/api-errors.js';
import xssFilters from 'xss-filters';

const oneDay = 1000 * 60 * 60 * 24;

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  let userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError(`The email: ${email} is already in use.`);
  }

  const user = await User.create({ name, email, password, role });
  const token = user.createToken();

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name
    },
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createToken();
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  user.password = undefined;

  res.status(StatusCodes.OK).json({
    user,
    location: user.location
  });
};

const updateUser = async (req, res) => {
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

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({
    user,
    location: user.location
  });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({
    msg: 'User logged out!'
  });
};

export { register, login, updateUser, getCurrentUser, logout };
