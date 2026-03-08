import mongoose from "mongoose";
const { Schema } = mongoose;

import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 2,
    maxlength: 30,
    trim: true,
  },
  firstName: { type: String, trim: true, default: '' },
  lastName: {
    type: String,
    trim: true,
    maxlength: 30,
    default: '',
  },
  fullName: { type: String, trim: true, default: '' },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email!'
    },
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 3,
    select: false,
  },
  phone: { type: String, trim: true, default: '' },
  location: {
    type: String,
    trim: true,
    maxlength: 100,
    default: 'my location',
  },
  city: { type: String, trim: true, default: '' },
  state: { type: String, trim: true, default: '' },
  country: { type: String, trim: true, default: '' },

  // Profile Meta
  profilePicture: { type: String, default: '' },
  headline: { type: String, trim: true, default: '' },
  bio: {
    type: String,
    maxlength: 1000,
    default: '',
  },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer not to say', ''], default: '' },

  // Social & Links
  portfolioUrl: { type: String, trim: true, default: '' },
  linkedinUrl: { type: String, trim: true, default: '' },
  githubUrl: { type: String, trim: true, default: '' },
  personalWebsite: { type: String, trim: true, default: '' },

  // Professional Assets
  resume: { type: String, default: '' }, // Text version
  resumeUrl: { type: String, default: '' }, // Link to file
  resumeFileName: { type: String, default: '' },

  // Skills & Tech
  skills: { type: [String], default: [] },
  primarySkills: { type: [String], default: [] },
  secondarySkills: { type: [String], default: [] },
  techStack: { type: [String], default: [] },

  // Experience
  experienceYears: { type: Number, default: 0 },
  currentCompany: { type: String, default: '' },
  currentJobTitle: { type: String, default: '' },
  previousCompanies: [{
    companyName: String,
    jobTitle: String,
    duration: String,
    description: String,
  }],

  // Education
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String,
  }],
  degree: { type: String, default: '' },
  specialization: { type: String, default: '' },
  university: { type: String, default: '' },
  graduationYear: { type: Number },
  cgpa: { type: Number },

  // Portfolio/Other
  certifications: { type: [String], default: [] },
  projects: [{
    title: String,
    description: String,
    link: String,
    techStack: [String],
  }],

  // Preferences
  preferredJobRole: { type: String, default: '' },
  preferredJobType: { type: String, default: '' },
  preferredWorkMode: { type: String, enum: ['remote', 'on-site', 'hybrid', ''], default: '' },
  expectedSalaryMin: { type: Number, default: 0 },
  expectedSalaryMax: { type: Number, default: 0 },
  salaryCurrency: { type: String, default: 'USD' },
  preferredLocations: { type: [String], default: [] },
  noticePeriod: { type: String, default: '' },
  immediateJoiner: { type: Boolean, default: false },
  openToWork: { type: Boolean, default: true },

  // Visibility & Meta
  role: {
    type: String,
    enum: ['seeker', 'hr'],
    default: 'seeker',
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'private', 'hidden'],
    default: 'public'
  },
  profileViews: { type: Number, default: 0 },
  recruiterContactCount: { type: Number, default: 0 },

  // Job Tracking
  savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  applicationHistory: [{ type: Schema.Types.ObjectId, ref: 'Application' }],

  // IDs & Slugs
  candidateId: { type: String, unique: true, sparse: true },
  slug: { type: String, unique: true, sparse: true },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  console.log(this.modifiedPaths());

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.createToken = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.SECRET_KEY,
    { expiresIn: process.env.LIFETIME }
  );
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.password);
  return isMatch;
}

export default mongoose.model('User', UserSchema);