import { Request, Response } from 'express';
import { PrismaClient, FillEventStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for FillEvent entity.
 */
export class FillEventController {
    // PUBLIC_INTERFACE
    /**
     * Create a fill event for a facility.
     */
    static async create(req: Request, res: Response) {
        try {
            const { facilityId, status, notes, timestamp, operator } = req.body;
            const fillEvent = await prisma.fillEvent.create({
                data: {
                    facilityId,
                    status,
                    notes,
                    timestamp,
                    operator
                }
            });
            return res.status(201).json(fillEvent);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get all fill events (time-series) with optional facility filter.
     */
    static async findAll(req: Request, res: Response) {
        try {
            const { facilityId } = req.query;
            const where: any = {};
            if (facilityId) where.facilityId = String(facilityId);

            const fillEvents = await prisma.fillEvent.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                include: { facility: true, tagValues: true }
            });
            return res.json(fillEvents);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get a fill event by ID.
     */
    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const fillEvent = await prisma.fillEvent.findUnique({
                where: { id },
                include: { facility: true, tagValues: true }
            });
            if (!fillEvent) return res.status(404).json({ message: "FillEvent not found." });
            return res.json(fillEvent);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Update a fill event.
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status, notes, timestamp, operator } = req.body;
            const fillEvent = await prisma.fillEvent.update({
                where: { id },
                data: { status, notes, timestamp, operator }
            });
            return res.json(fillEvent);
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "FillEvent not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Delete a fill event.
     */
    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.fillEvent.delete({
                where: { id }
            });
            return res.status(204).send();
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "FillEvent not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }
}

export default FillEventController;
