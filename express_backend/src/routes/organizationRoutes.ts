import { Router } from 'express';
import OrganizationController from '../controllers/organizationController';

/**
 * Routes for Organization entity.
 */
const router = Router();

// Create a new organization
router.post('/', OrganizationController.create);

// Get all organizations
router.get('/', OrganizationController.findAll);

// Get a single organization by ID
router.get('/:id', OrganizationController.findById);

// Update an organization by ID
router.put('/:id', OrganizationController.update);

// Delete an organization by ID
router.delete('/:id', OrganizationController.remove);

export default router;
