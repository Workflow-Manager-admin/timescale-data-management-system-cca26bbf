const express = require('express');
const healthController = require('../controllers/health');

// Import resource routes (use require/interop for TS/JS compatibility)
const organizationRoutes = require('./organizationRoutes.ts').default || require('./organizationRoutes');
const facilityRoutes = require('./facilityRoutes.ts').default || require('./facilityRoutes');
const fillEventRoutes = require('./fillEventRoutes.ts').default || require('./fillEventRoutes');
const tagValueRoutes = require('./tagValueRoutes.ts').default || require('./tagValueRoutes');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Register resource subroutes (prefixes)
// e.g. /organizations, /facilities, /fill-events, /tag-values
router.use('/organizations', organizationRoutes);
router.use('/facilities', facilityRoutes);
router.use('/fill-events', fillEventRoutes);
router.use('/tag-values', tagValueRoutes);

module.exports = router;
