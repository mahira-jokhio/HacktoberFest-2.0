import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest,
    assignWorker,
    updateStatus
} from '../controllers/request.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Base routes
router.route('/')
    .post(createRequest)
    .get(getRequests);

// Individual request routes
router.route('/:id')
    .get(getRequest)
    .put(updateRequest)
    .delete(deleteRequest);

// Special operations
router.put('/:id/assign', assignWorker);
router.put('/:id/status', updateStatus);

export default router;
