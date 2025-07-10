import { Router } from 'express';
import TagValueController from '../controllers/tagValueController';

/**
 * Routes for TagValue entity and aggregation.
 */
const router = Router();

/**
 * @swagger
 * tags:
 *   name: TagValues
 *   description: API for managing tag values (time-series data)
 */

/**
 * @swagger
 * /tag-values:
 *   post:
 *     summary: Create a tag value for a fill event
 *     tags: [TagValues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fillEventId
 *               - name
 *               - type
 *               - value
 *               - timestamp
 *             properties:
 *               fillEventId:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PRESSURE, TEMPERATURE, FLOW, LEVEL, OTHER]
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *             example:
 *               fillEventId: "fillEvent-uuid"
 *               name: "TempOutlet"
 *               type: TEMPERATURE
 *               value: 67.5
 *               unit: "C"
 *               timestamp: 2024-05-22T15:00:00Z
 *     responses:
 *       201:
 *         description: Tag value created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagValue'
 *       500:
 *         description: Internal server error
 */
router.post('/', TagValueController.create);

/**
 * @swagger
 * /tag-values:
 *   get:
 *     summary: Get tag values (filter by fillEventId, name, time range)
 *     tags: [TagValues]
 *     parameters:
 *       - in: query
 *         name: fillEventId
 *         schema:
 *           type: string
 *         description: Filter by fill event
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by tag name
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Minimum timestamp (ISO8601)
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Maximum timestamp (ISO8601)
 *     responses:
 *       200:
 *         description: List of tag values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TagValue'
 *       500:
 *         description: Internal server error
 */
router.get('/', TagValueController.findAll);

/**
 * @swagger
 * /tag-values/{id}:
 *   get:
 *     summary: Get a tag value by ID
 *     tags: [TagValues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag value ID
 *     responses:
 *       200:
 *         description: Tag value details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagValue'
 *       404:
 *         description: TagValue not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', TagValueController.findById);

/**
 * @swagger
 * /tag-values/{id}:
 *   put:
 *     summary: Update a tag value by ID
 *     tags: [TagValues]
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
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tag value updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagValue'
 *       404:
 *         description: TagValue not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', TagValueController.update);

/**
 * @swagger
 * /tag-values/{id}:
 *   delete:
 *     summary: Delete a tag value by ID
 *     tags: [TagValues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tag value deleted
 *       404:
 *         description: TagValue not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', TagValueController.remove);

/**
 * @swagger
 * /tag-values/aggregate/data:
 *   get:
 *     summary: Aggregate tag values by time bucket and tag name
 *     tags: [TagValues]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name for aggregation
 *       - in: query
 *         name: interval
 *         required: true
 *         schema:
 *           type: string
 *         description: Bucket size, e.g. '1 hour', '5 minutes'
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of time range (ISO8601)
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of time range (ISO8601)
 *     responses:
 *       200:
 *         description: Aggregated tag analytics (buckets)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bucket:
 *                     type: string
 *                   avg:
 *                     type: number
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   count:
 *                     type: integer
 *       400:
 *         description: Missing required parameter
 *       500:
 *         description: Internal server error
 */
router.get('/aggregate/data', TagValueController.aggregate);

export default router;
