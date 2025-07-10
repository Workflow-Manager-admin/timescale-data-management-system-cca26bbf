import { PrismaClient, FillEvent, FillEventStatus } from '@prisma/client';

const prisma = new PrismaClient();

// PUBLIC_INTERFACE
/**
 * Service for FillEvent entity logic and Timescale time-series operations.
 */
export class FillEventService {
    // PUBLIC_INTERFACE
    /**
     * Create a fill event for a facility.
     */
    static async createFillEvent(data: {
        facilityId: string;
        status: FillEventStatus;
        notes?: string;
        timestamp: Date;
        operator?: string;
    }): Promise<FillEvent> {
        return prisma.fillEvent.create({ data });
    }

    // PUBLIC_INTERFACE
    /**
     * Get all fill events (optionally filter by facilityId).
     */
    static async getAllFillEvents(filter?: { facilityId?: string }): Promise<FillEvent[]> {
        return prisma.fillEvent.findMany({
            where: filter,
            orderBy: { timestamp: 'desc' },
            include: { facility: true, tagValues: true },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Get a fill event by its ID.
     */
    static async getFillEventById(id: string): Promise<FillEvent | null> {
        return prisma.fillEvent.findUnique({
            where: { id },
            include: { facility: true, tagValues: true },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Update a fill event.
     */
    static async updateFillEvent(
        id: string,
        updates: { status?: FillEventStatus; notes?: string; timestamp?: Date; operator?: string }
    ): Promise<FillEvent> {
        return prisma.fillEvent.update({
            where: { id },
            data: updates,
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Delete a fill event by ID.
     */
    static async deleteFillEvent(id: string): Promise<void> {
        await prisma.fillEvent.delete({ where: { id } });
    }
}

export default FillEventService;
