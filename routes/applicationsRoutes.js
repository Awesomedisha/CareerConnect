import express from 'express';
const router = express.Router();

import {
    applyToJob,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
} from '../controllers/applicationsController.js';

router.route('/').post(applyToJob).get(getMyApplications);
router.route('/:jobId/applications').get(getJobApplications);
router.route('/:id').patch(updateApplicationStatus);

export default router;
