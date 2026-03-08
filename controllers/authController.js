import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/api-errors.js';
import xssFilters from 'xss-filters';
import { saveUser, findUserByEmail } from '../utils/userStorage.js';

const oneDay = 1000 * 60 * 60 * 24;

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError("Please provide name, email, and password");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError("Account with this email already exists");
  }

  // Create user - our UserStorage handles both MongoDB and JSON backup
  const user = await saveUser({ name, email, password, role: role || 'seeker' });

  // Generate token - support both Mongoose and plain objects
  const token = (user && typeof user.createToken === 'function')
    ? user.createToken()
    : 'session_' + Date.now();

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
      location: user.location || '',
    },
    location: user.location || '',
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnAuthenticatedError("No account found with this email");
  }

  // Support both Mongoose models (comparePassword) and raw objects (direct comparison)
  let isPasswordCorrect = false;
  if (user.comparePassword && typeof user.comparePassword === 'function') {
    isPasswordCorrect = await user.comparePassword(password);
  } else {
    // For seeded/JSON users, we might have direct matching if bcrypt wasn't used
    isPasswordCorrect = (password === user.password);
  }

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid password. Please try again.");
  }

  const token = (user && typeof user.createToken === 'function')
    ? user.createToken()
    : 'session_' + Date.now();

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

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
