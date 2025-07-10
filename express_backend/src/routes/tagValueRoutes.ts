import { Router } from 'express';
import TagValueController from '../controllers/tagValueController';

/**
 * Routes for TagValue entity and aggregation.
 */
const router = Router();

// Create a tag value
router.post('/', TagValueController.create);

// Get tag values (supports filtering)
router.get('/', TagValueController.findAll);

// Get tag value by ID
router.get('/:id', TagValueController.findById);

// Update a tag value by ID
router.put('/:id', TagValueController.update);

// Delete tag value by ID
router.delete('/:id', TagValueController.remove);

// Aggregate: GET /api/tag-values/aggregate?name=...&interval=1 hour&startTime=...&endTime=...
router.get('/aggregate/data', TagValueController.aggregate);

export default router;
