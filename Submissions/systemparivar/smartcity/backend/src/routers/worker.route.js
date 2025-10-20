import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    registerWorker,
    getWorkers,
    getWorker,
    updateWorker,
    updateLocation,
    getAssignments,
    deleteWorker
} from '../controllers/worker.controller.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Worker registration and listing
router.route('/')
    .post(registerWorker)
    .get(getWorkers);

// Individual worker operations
router.route('/:id')
    .get(getWorker)
    .put(updateWorker)
    .delete(deleteWorker);

// Worker specific routes
router.put('/:id/location', updateLocation);
router.get('/assignments', getAssignments);

export default router;
