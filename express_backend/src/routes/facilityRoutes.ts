import { Router } from 'express';
import FacilityController from '../controllers/facilityController';

/**
 * Routes for Facility entity.
 */
const router = Router();

// Create a new facility
router.post('/', FacilityController.create);

// Get all facilities
router.get('/', FacilityController.findAll);

// Get a specific facility by ID
router.get('/:id', FacilityController.findById);

// Update a facility by ID
router.put('/:id', FacilityController.update);

// Delete a facility by ID
router.delete('/:id', FacilityController.remove);

export default router;
