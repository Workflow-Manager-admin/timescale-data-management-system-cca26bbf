import { PrismaClient, Facility } from '@prisma/client';

const prisma = new PrismaClient();

// PUBLIC_INTERFACE
/**
 * Service for Facility business logic and DB access.
 */
export class FacilityService {
    // PUBLIC_INTERFACE
    /**
     * Create a new facility under an organization.
     */
    static async createFacility(data: { name: string; description?: string; organizationId: string; }): Promise<Facility> {
        return prisma.facility.create({ data });
    }

    // PUBLIC_INTERFACE
    /**
     * Get all facilities (with organization and fillEvents).
     */
    static async getAllFacilities(): Promise<Facility[]> {
        return prisma.facility.findMany({
            include: { organization: true, fillEvents: true },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Get one facility by its ID.
     */
    static async getFacilityById(id: string): Promise<Facility | null> {
        return prisma.facility.findUnique({
            where: { id },
            include: { organization: true, fillEvents: true },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Update a facility by ID.
     */
    static async updateFacility(id: string, updates: { name?: string; description?: string; organizationId?: string; }): Promise<Facility> {
        return prisma.facility.update({
            where: { id },
            data: updates,
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Delete a facility by ID.
     */
    static async deleteFacility(id: string): Promise<void> {
        await prisma.facility.delete({ where: { id } });
    }
}

export default FacilityService;
