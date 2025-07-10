import { Router } from 'express';
import FacilityController from '../controllers/facilityController';

/**
 * Routes for Facility entity.
 */
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Facilities
 *   description: API for managing facilities
 */

/**
 * @swagger
 * /facilities:
 *   post:
 *     summary: Create a new facility
 *     tags: [Facilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - organizationId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               organizationId:
 *                 type: string
 *             example:
 *               name: "Plant 1"
 *               description: "First production plant"
 *               organizationId: "org-uuid"
 *     responses:
 *       201:
 *         description: Facility created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
 *       409:
 *         description: Facility already exists for the organization
 *       500:
 *         description: Internal server error
 */
router.post('/', FacilityController.create);

/**
 * @swagger
 * /facilities:
 *   get:
 *     summary: Get all facilities
 *     tags: [Facilities]
 *     responses:
 *       200:
 *         description: List of facilities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Facility'
 *       500:
 *         description: Internal server error
 */
router.get('/', FacilityController.findAll);

/**
 * @swagger
 * /facilities/{id}:
 *   get:
 *     summary: Get a facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Facility ID
 *     responses:
 *       200:
 *         description: Facility details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
 *       404:
 *         description: Facility not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', FacilityController.findById);

/**
 * @swagger
 * /facilities/{id}:
 *   put:
 *     summary: Update a facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               organizationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facility updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
 *       404:
 *         description: Facility not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', FacilityController.update);

/**
 * @swagger
 * /facilities/{id}:
 *   delete:
 *     summary: Delete a facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Facility deleted
 *       404:
 *         description: Facility not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', FacilityController.remove);

export default router;
