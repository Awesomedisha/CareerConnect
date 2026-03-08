import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';
import { UnAuthenticatedError } from '../errors/index.js';
import xssFilters from 'xss-filters';

const oneDay = 1000 * 60 * 60 * 24;

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    // next(new Error());  // If not using http-status-codes
    throw new BadRequestError("Please provide all values");
  }

  let userAlreadyExists;
  try {
    userAlreadyExists = await User.findOne({ email });
  } catch (error) {
    console.error('Database query error (register):', error);
    throw new Error('Database connection issue. Please ensure your IP is whitelisted in MongoDB Atlas.');
  }

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

  // Get the user in db whose email matches with the one from request
  let user;
  try {
    user = await User.findOne({ email }).select('+password');
  } catch (error) {
    console.error('Database query error (login):', error);
    throw new Error('Database connection issue. Please ensure your IP is whitelisted in MongoDB Atlas.');
  }

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  // Compare password
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
  const {
    email, name, lastName, location, role, bio, resume,
    firstName, fullName, phone, city, state, country,
    profilePicture, headline, dateOfBirth, gender,
    portfolioUrl, linkedinUrl, githubUrl, personalWebsite,
    resumeUrl, resumeFileName,
    skills, primarySkills, secondarySkills, techStack,
    experienceYears, currentCompany, currentJobTitle, previousCompanies,
    education, degree, specialization, university, graduationYear, cgpa,
    certifications, projects,
    preferredJobRole, preferredJobType, preferredWorkMode,
    expectedSalaryMin, expectedSalaryMax, salaryCurrency,
    preferredLocations, noticePeriod, immediateJoiner, openToWork,
    profileVisibility
  } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Please provide essential values (name, email)");
  }

  const user = await User.findOne({ _id: req.user.userId });

  // Basic Info sanitization
  user.email = email;
  user.name = xssFilters.inHTMLData(name);
  if (firstName !== undefined) user.firstName = xssFilters.inHTMLData(firstName);
  if (lastName !== undefined) user.lastName = xssFilters.inHTMLData(lastName);
  if (fullName !== undefined) user.fullName = xssFilters.inHTMLData(fullName);
  if (phone !== undefined) user.phone = xssFilters.inHTMLData(phone);
  if (location !== undefined) user.location = xssFilters.inHTMLData(location);
  if (city !== undefined) user.city = xssFilters.inHTMLData(city);
  if (state !== undefined) user.state = xssFilters.inHTMLData(state);
  if (country !== undefined) user.country = xssFilters.inHTMLData(country);

  // Profile Meta
  if (profilePicture !== undefined) user.profilePicture = xssFilters.inHTMLData(profilePicture);
  if (headline !== undefined) user.headline = xssFilters.inHTMLData(headline);
  if (bio !== undefined) user.bio = xssFilters.inHTMLData(bio);
  if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
  if (gender !== undefined) user.gender = gender;

  // Social & Links
  if (portfolioUrl !== undefined) user.portfolioUrl = xssFilters.inHTMLData(portfolioUrl);
  if (linkedinUrl !== undefined) user.linkedinUrl = xssFilters.inHTMLData(linkedinUrl);
  if (githubUrl !== undefined) user.githubUrl = xssFilters.inHTMLData(githubUrl);
  if (personalWebsite !== undefined) user.personalWebsite = xssFilters.inHTMLData(personalWebsite);

  // Professional Assets
  if (resume !== undefined) user.resume = xssFilters.inHTMLData(resume);
  if (resumeUrl !== undefined) user.resumeUrl = xssFilters.inHTMLData(resumeUrl);
  if (resumeFileName !== undefined) user.resumeFileName = xssFilters.inHTMLData(resumeFileName);

  // Skills & Tech (Arrays)
  if (skills !== undefined) user.skills = Array.isArray(skills) ? skills.map(s => xssFilters.inHTMLData(s)) : [];
  if (primarySkills !== undefined) user.primarySkills = Array.isArray(primarySkills) ? primarySkills.map(s => xssFilters.inHTMLData(s)) : [];
  if (secondarySkills !== undefined) user.secondarySkills = Array.isArray(secondarySkills) ? secondarySkills.map(s => xssFilters.inHTMLData(s)) : [];
  if (techStack !== undefined) user.techStack = Array.isArray(techStack) ? techStack.map(s => xssFilters.inHTMLData(s)) : [];

  // Experience
  if (experienceYears !== undefined) user.experienceYears = Number(experienceYears);
  if (currentCompany !== undefined) user.currentCompany = xssFilters.inHTMLData(currentCompany);
  if (currentJobTitle !== undefined) user.currentJobTitle = xssFilters.inHTMLData(currentJobTitle);
  if (previousCompanies !== undefined) user.previousCompanies = previousCompanies;

  // Education
  if (education !== undefined) user.education = education;
  if (degree !== undefined) user.degree = xssFilters.inHTMLData(degree);
  if (specialization !== undefined) user.specialization = xssFilters.inHTMLData(specialization);
  if (university !== undefined) user.university = xssFilters.inHTMLData(university);
  if (graduationYear !== undefined) user.graduationYear = Number(graduationYear);
  if (cgpa !== undefined) user.cgpa = Number(cgpa);

  // Projects & Certs
  if (certifications !== undefined) user.certifications = Array.isArray(certifications) ? certifications.map(c => xssFilters.inHTMLData(c)) : [];
  if (projects !== undefined) user.projects = projects;

  // Preferences
  if (preferredJobRole !== undefined) user.preferredJobRole = xssFilters.inHTMLData(preferredJobRole);
  if (preferredJobType !== undefined) user.preferredJobType = preferredJobType;
  if (preferredWorkMode !== undefined) user.preferredWorkMode = preferredWorkMode;
  if (expectedSalaryMin !== undefined) user.expectedSalaryMin = Number(expectedSalaryMin);
  if (expectedSalaryMax !== undefined) user.expectedSalaryMax = Number(expectedSalaryMax);
  if (salaryCurrency !== undefined) user.salaryCurrency = xssFilters.inHTMLData(salaryCurrency);
  if (preferredLocations !== undefined) user.preferredLocations = Array.isArray(preferredLocations) ? preferredLocations.map(l => xssFilters.inHTMLData(l)) : [];
  if (noticePeriod !== undefined) user.noticePeriod = xssFilters.inHTMLData(noticePeriod);
  if (immediateJoiner !== undefined) user.immediateJoiner = Boolean(immediateJoiner);
  if (openToWork !== undefined) user.openToWork = Boolean(openToWork);

  // Misc
  if (role) user.role = role;
  if (profileVisibility) user.profileVisibility = profileVisibility;

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

export { register, login, updateUser, getCurrentUser, logout }