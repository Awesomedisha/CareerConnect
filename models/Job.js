import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const JobSchema = new Schema({
  company: {
    type: String,
    required: [true, 'Please provide company'],
    maxLength: 100,
  },
  companyName: String,
  companyLogo: String,
  companyId: String,
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100,
  },
  title: String,
  jobRole: String,
  jobCategory: String,
  department: String,
  slug: {
    type: String,
    lowercase: true,
  },
  jobId: String,
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending', 'open', 'closed', 'draft'],
    default: 'open',
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'internship', 'contract', 'freelance'],
    default: 'full-time',
  },
  employmentType: String,
  workMode: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site',
  },
  jobLocation: {
    type: String,
    required: true,
  },
  locationCity: String,
  locationState: String,
  locationCountry: String,
  locationAddress: String,
  description: String,
  responsibilities: String,
  requirements: {
    type: String,
    default: '',
  },
  skillsRequired: [String],
  skillsPreferred: [String],
  techStack: [String],
  experienceMin: Number,
  experienceMax: Number,
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
  },
  educationRequired: String,
  degreeRequired: String,
  minimumCGPA: Number,
  salaryMin: Number,
  salaryMax: Number,
  currency: {
    type: String,
    default: 'USD',
  },
  salaryPeriod: {
    type: String,
    enum: ['monthly', 'yearly', 'hourly'],
    default: 'monthly',
  },
  isNegotiable: {
    type: Boolean,
    default: false,
  },
  openings: {
    type: Number,
    default: 1,
  },
  benefits: [String],
  perks: [String],
  applicationMethod: String,
  externalApplyLink: String,
  applicationDeadline: Date,
  expectedJoiningDate: Date,
  interviewRounds: Number,
  interviewProcess: String,
  assessmentRequired: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  bookmarkCount: {
    type: Number,
    default: 0,
  },
  tags: [String],
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  recruiterId: String,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the User'],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  deletedAt: Date,
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);