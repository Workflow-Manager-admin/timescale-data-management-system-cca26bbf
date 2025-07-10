import { PrismaClient, TagValue, TagType } from '@prisma/client';

// For advanced time-series aggregation, use raw SQL with TimescaleDB's time_bucket() and continuous aggregates.
const prisma = new PrismaClient();

// PUBLIC_INTERFACE
/**
 * Service for TagValue business logic, time-series data access, and TimescaleDB aggregation.
 */
export class TagValueService {
    // PUBLIC_INTERFACE
    /**
     * Create a tag value for a fill event.
     */
    static async createTagValue(data: {
        fillEventId: string;
        name: string;
        type: TagType;
        value: number;
        unit?: string;
        timestamp: Date;
    }): Promise<TagValue> {
        return prisma.tagValue.create({ data });
    }

    // PUBLIC_INTERFACE
    /**
     * Get tag values filtered by fillEventId, name, and/or time range.
     */
    static async getTagValues(filter: {
        fillEventId?: string;
        name?: string;
        startTime?: Date;
        endTime?: Date;
    }): Promise<TagValue[]> {
        const where: Record<string, any> = {};
        if (filter.fillEventId) where.fillEventId = filter.fillEventId;
        if (filter.name) where.name = filter.name;
        if (filter.startTime || filter.endTime) {
            where.timestamp = {};
            if (filter.startTime) where.timestamp.gte = filter.startTime;
            if (filter.endTime) where.timestamp.lte = filter.endTime;
        }

        return prisma.tagValue.findMany({
            where,
            orderBy: { timestamp: 'desc' },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Get a tag value by its ID.
     */
    static async getTagValueById(id: string): Promise<TagValue | null> {
        return prisma.tagValue.findUnique({ where: { id } });
    }

    // PUBLIC_INTERFACE
    /**
     * Update a tag value.
     */
    static async updateTagValue(id: string, updates: { value?: number; unit?: string; timestamp?: Date }): Promise<TagValue> {
        return prisma.tagValue.update({
            where: { id },
            data: updates,
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Delete a tag value by ID.
     */
    static async deleteTagValue(id: string): Promise<void> {
        await prisma.tagValue.delete({ where: { id } });
    }

    // PUBLIC_INTERFACE
    /**
     * Aggregate TagValues by bucket interval and name, using time_bucket().
     * Returns average, min, max, and count per bucket for analytics/dashboard.
     * interval: e.g. '1 hour', '5 minutes', etc.
     */
    static async aggregateTagValues(params: {
        name: string;
        interval: string;
        startTime?: Date;
        endTime?: Date;
    }): Promise<any[]> {
        // Defensive: Default times if missing
        const start = params.startTime ? params.startTime.toISOString() : new Date(0).toISOString();
        const end = params.endTime ? params.endTime.toISOString() : new Date().toISOString();

        // Use $queryRawUnsafe for advanced SQL aggregate (valid for trusted parameters).
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
        // @ts-ignore
        return prisma.$queryRawUnsafe(sql, params.interval, params.name, start, end);
    }
}

export default TagValueService;
