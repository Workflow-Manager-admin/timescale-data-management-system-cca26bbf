import { Router } from 'express';
import FillEventController from '../controllers/fillEventController';

/**
 * Routes for FillEvent entity.
 */
const router = Router();

// Create a fill event
router.post('/', FillEventController.create);

// Get all fill events (optionally filter by facility)
router.get('/', FillEventController.findAll);

// Get a specific fill event by ID
router.get('/:id', FillEventController.findById);

// Update a fill event
router.put('/:id', FillEventController.update);

// Delete a fill event
router.delete('/:id', FillEventController.remove);

export default router;
