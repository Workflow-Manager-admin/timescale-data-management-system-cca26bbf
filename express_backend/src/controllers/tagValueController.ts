import { Request, Response } from 'express';
import { PrismaClient, TagType } from '@prisma/client';

// Use raw SQL for TimescaleDB aggregates; Prisma does not natively expose continuous aggregates yet.
const prisma = new PrismaClient();

/**
 * Controller for TagValue entity and time-series aggregations.
 */
export class TagValueController {
    // PUBLIC_INTERFACE
    /**
     * Create a tag value for a fill event.
     */
    static async create(req: Request, res: Response) {
        try {
            const { fillEventId, name, type, value, unit, timestamp } = req.body;
            const tagValue = await prisma.tagValue.create({
                data: { fillEventId, name, type, value, unit, timestamp }
            });
            return res.status(201).json(tagValue);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get tag values, filtered by fillEventId, tag name, or time range.
     */
    static async findAll(req: Request, res: Response) {
        try {
            const { fillEventId, name, startTime, endTime } = req.query;

            const where: any = {};
            if (fillEventId) where.fillEventId = String(fillEventId);
            if (name) where.name = String(name);
            if (startTime || endTime) {
                where.timestamp = {};
                if (startTime) where.timestamp.gte = new Date(String(startTime));
                if (endTime) where.timestamp.lte = new Date(String(endTime));
            }

            const tagValues = await prisma.tagValue.findMany({
                where,
                orderBy: { timestamp: 'desc' }
            });
            return res.json(tagValues);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get a tag value by ID.
     */
    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tagValue = await prisma.tagValue.findUnique({
                where: { id }
            });
            if (!tagValue) return res.status(404).json({ message: "TagValue not found." });
            return res.json(tagValue);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Update a tag value.
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { value, unit, timestamp } = req.body;
            const tagValue = await prisma.tagValue.update({
                where: { id },
                data: { value, unit, timestamp }
            });
            return res.json(tagValue);
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "TagValue not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Delete a tag value.
     */
    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.tagValue.delete({
                where: { id }
            });
            return res.status(204).send();
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "TagValue not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Aggregate TagValues: Compute average/min/max per time bucket for a tag name.
     * Query params example: ?name=TempOutlet&interval=1 hour&startTime=2024-01-01T00:00:00Z&endTime=2024-02-01T00:00:00Z
     */
    static async aggregate(req: Request, res: Response) {
        try {
            const { name, interval, startTime, endTime } = req.query;
            if (!name || !interval) {
                return res.status(400).json({ message: "Missing required query param: name and interval" });
            }
            // Use raw SQL for aggregation with TimescaleDB time_bucket()
            const sql = `
                SELECT
                    time_bucket($1, "timestamp") as bucket,
                    AVG("value") as avg,
                    MIN("value") as min,
                    MAX("value") as max,
                    COUNT(*) as count
                FROM "tag_value"
                WHERE name = $2
                  AND "timestamp" >= $3
                  AND "timestamp" <= $4
                GROUP BY bucket
                ORDER BY bucket
                `;
            const params = [
                String(interval),
                String(name),
                startTime ? new Date(String(startTime)) : new Date(0),
                endTime ? new Date(String(endTime)) : new Date()
            ];

            // @ts-ignore: Prisma exposes $queryRaw for raw SQL
            const results = await prisma.$queryRawUnsafe(sql, ...params);
            return res.json(results);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
}

export default TagValueController;
