import express from 'express';
const router = express.Router();

import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobsController.js';

import { authenticateUser } from '../middleware/authenticate.js';

router.route('/').post(createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').delete(deleteJob).patch(updateJob);

export default router