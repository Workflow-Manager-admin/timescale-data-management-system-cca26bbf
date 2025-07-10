import { PrismaClient, Organization } from '@prisma/client';

const prisma = new PrismaClient();

// PUBLIC_INTERFACE
/**
 * Service for Organization business logic and DB access.
 */
export class OrganizationService {
    // PUBLIC_INTERFACE
    /**
     * Create a new organization.
     */
    static async createOrganization(data: { name: string; description?: string; }): Promise<Organization> {
        return prisma.organization.create({ data });
    }

    // PUBLIC_INTERFACE
    /**
     * Retrieve all organizations (with facilities).
     */
    static async getAllOrganizations(): Promise<Organization[]> {
        return prisma.organization.findMany({
            include: { facilities: true },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Find one organization by its ID (with facilities).
     */
    static async getOrganizationById(id: string): Promise<Organization | null> {
        return prisma.organization.findUnique({
            where: { id },
            include: { facilities: true },
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Update an organization.
     */
    static async updateOrganization(id: string, updates: { name?: string; description?: string; }): Promise<Organization> {
        return prisma.organization.update({
            where: { id },
            data: updates,
        });
    }

    // PUBLIC_INTERFACE
    /**
     * Delete an organization.
     */
    static async deleteOrganization(id: string): Promise<void> {
        await prisma.organization.delete({ where: { id } });
    }
}

export default OrganizationService;
