import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';
import xssFilters from 'xss-filters';

const createJob = async (req, res) => {
  // 1. Extract values from the request body
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please Provide All Values');
  }

  // Generate slug if title or position is provided
  if (req.body.title || position) {
    const baseSlug = req.body.title || position;
    req.body.slug = baseSlug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  // Sanitize specific string fields
  const stringFieldsToSanitize = [
    'company', 'position', 'title', 'jobRole', 'jobCategory', 'department',
    'locationCity', 'locationState', 'locationCountry', 'locationAddress',
    'description', 'responsibilities', 'requirements', 'educationRequired',
    'degreeRequired', 'applicationMethod', 'externalApplyLink', 'interviewProcess'
  ];

  stringFieldsToSanitize.forEach(field => {
    if (req.body[field]) {
      req.body[field] = xssFilters.inHTMLData(req.body[field]);
    }
  });

  req.body.createdBy = req.user.userId;

  // 5. Create the job in the database
  const job = await Job.create(req.body);

  // 6. Respond with 201, and a json of the job
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  // 1. Destructure the necessary variables from request's query
  const { search, status, jobType, sort, isPublicListing } = req.query;

  // 2. Sanitize the search input from the query
  req.query.search = xssFilters.inHTMLData(search);

  // 3. Create queryObject
  const queryObject = {};

  if (isPublicListing === 'true') {
    queryObject.isPublic = true;
  } else {
    queryObject.createdBy = req.user.userId;
  }

  // 4. Set the status of the query if not `all`
  if (status && status !== 'all') {
    queryObject.status = status;
  }

  // 5. Set the jobType of the query if not 'all'
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // 6. Add position property to queryObject if search is non-empty
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  // 7. Find the jobs created by the user from the request (WITHOUT await)
  let result = Job.find(queryObject);

  // 8. Chain sort conditions to filter results
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }

  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('position');
  }

  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // 9. Pagination Variables
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 10. Chain operations to modify the query based on the page variables
  result = result.skip(skip).limit(limit);

  // 11. Await filtered jobs by sort conditions & processed through pagination
  const jobs = await result;

  // 12. Calculate the variables needed to send back as a response
  const totalJobs = await Job.countDocuments(queryObject);

  // 13. Number of pages should accomodate the remainder with an extra page
  const numOfPages = Math.ceil(totalJobs / limit);

  // 14. Respond with 200 and a json containing the jobs, totalJobs, and pages
  res.status(StatusCodes.OK)
    .json({ jobs, totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
  // 1. Extract job ID from the request
  const { id: jobId } = req.params;

  // Sanitize input
  const stringFieldsToSanitize = [
    'company', 'position', 'title', 'jobRole', 'jobCategory', 'department',
    'locationCity', 'locationState', 'locationCountry', 'locationAddress',
    'description', 'responsibilities', 'requirements', 'educationRequired',
    'degreeRequired', 'applicationMethod', 'externalApplyLink', 'interviewProcess'
  ];

  stringFieldsToSanitize.forEach(field => {
    if (req.body[field]) {
      req.body[field] = xssFilters.inHTMLData(req.body[field]);
    }
  });

  // Update slug if title or position changes
  if (req.body.title || position) {
    const baseSlug = req.body.title || position;
    req.body.slug = baseSlug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  // 9. Send a 200 Response with a json of the newly updated job
  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  // 1. Extract job id from the request
  const { id: jobId } = req.params;

  // 2. Access the corresponding job document through our Job model with findOne()
  const job = await Job.findOne({ _id: jobId });

  // 3. Check if we found the job
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  // 4. Check if user has permissions
  checkPermissions(req.user, job.createdBy);

  // 5. Remove the job document from the model
  await job.deleteOne();

  // 6. Respond with OK status and a msg to indicate to front-end that job is deleted
  res.status(StatusCodes.OK).json({ msg: 'Job removed successfully.' });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt'
          },
          month: {
            $month: '$createdAt'
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;

    const date = moment()
      .month(month - 1)
      .year(year)
      .format('MMM YYYY');

    return { date, count };
  }).reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, getAllJobs, updateJob, deleteJob, showStats }
