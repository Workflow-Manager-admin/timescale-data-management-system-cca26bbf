import { Router } from 'express';
import OrganizationController from '../controllers/organizationController';

/**
 * Routes for Organization entity.
 */
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: API for managing organizations
 */

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: "Acme Inc."
 *               description: "A sample organization"
 *     responses:
 *       201:
 *         description: Organization created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       409:
 *         description: Organization already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', OrganizationController.create);

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Internal server error
 */
router.get('/', OrganizationController.findAll);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Get a single organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The organization ID
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', OrganizationController.findById);

/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     summary: Update an organization by ID
 *     tags: [Organizations]
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
 *     responses:
 *       200:
 *         description: Organization updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', OrganizationController.update);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: Delete an organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Organization deleted
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', OrganizationController.remove);

export default router;
