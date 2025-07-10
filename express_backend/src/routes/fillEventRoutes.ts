import { Router } from 'express';
import FillEventController from '../controllers/fillEventController';

/**
 * Routes for FillEvent entity.
 */
const router = Router();

/**
 * @swagger
 * tags:
 *   name: FillEvents
 *   description: API for managing fill events (time-series records)
 */

/**
 * @swagger
 * /fill-events:
 *   post:
 *     summary: Create a new fill event for a facility
 *     tags: [FillEvents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facilityId
 *               - status
 *               - timestamp
 *             properties:
 *               facilityId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PLANNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               operator:
 *                 type: string
 *             example:
 *               facilityId: "f1-uuid"
 *               status: IN_PROGRESS
 *               notes: "Line maintenance scheduled"
 *               timestamp: 2024-05-22T12:20:00Z
 *               operator: "alice"
 *     responses:
 *       201:
 *         description: Fill event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FillEvent'
 *       500:
 *         description: Internal server error
 */
router.post('/', FillEventController.create);

/**
 * @swagger
 * /fill-events:
 *   get:
 *     summary: Get all fill events (optionally filter by facilityId)
 *     tags: [FillEvents]
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *         description: Facility for which to fetch fill events
 *     responses:
 *       200:
 *         description: List of fill events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FillEvent'
 *       500:
 *         description: Internal server error
 */
router.get('/', FillEventController.findAll);

/**
 * @swagger
 * /fill-events/{id}:
 *   get:
 *     summary: Get a fill event by ID
 *     tags: [FillEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fill event ID
 *     responses:
 *       200:
 *         description: Fill event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FillEvent'
 *       404:
 *         description: FillEvent not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', FillEventController.findById);

/**
 * @swagger
 * /fill-events/{id}:
 *   put:
 *     summary: Update a fill event by ID
 *     tags: [FillEvents]
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
 *               status:
 *                 type: string
 *                 enum: [PLANNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               operator:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fill event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FillEvent'
 *       404:
 *         description: FillEvent not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', FillEventController.update);

/**
 * @swagger
 * /fill-events/{id}:
 *   delete:
 *     summary: Delete a fill event by ID
 *     tags: [FillEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Fill event deleted
 *       404:
 *         description: FillEvent not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', FillEventController.remove);

export default router;
