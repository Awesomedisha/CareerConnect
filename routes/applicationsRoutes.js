import express from 'express';
const router = express.Router();

import {
    applyToJob,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    getPredictedFit,
} from '../controllers/applicationsController.js';

router.route('/').post(applyToJob).get(getMyApplications);
router.route('/predicted-fit').post(getPredictedFit);
router.route('/:jobId/applications').get(getJobApplications);
router.route('/:id').patch(updateApplicationStatus);

export default router;
