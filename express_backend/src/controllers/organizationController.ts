import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for Organization entity.
 */
export class OrganizationController {
    // PUBLIC_INTERFACE
    /**
     * Create a new organization.
     */
    static async create(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const org = await prisma.organization.create({
                data: { name, description }
            });
            return res.status(201).json(org);
        } catch (err: any) {
            if (err.code === 'P2002') {
                return res.status(409).json({ message: "Organization already exists." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get all organizations.
     */
    static async findAll(req: Request, res: Response) {
        try {
            const organizations = await prisma.organization.findMany({
                include: { facilities: true }
            });
            return res.json(organizations);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get one organization by ID.
     */
    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const org = await prisma.organization.findUnique({
                where: { id },
                include: { facilities: true }
            });
            if (!org) return res.status(404).json({ message: "Organization not found." });
            return res.json(org);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Update an organization.
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const org = await prisma.organization.update({
                where: { id },
                data: { name, description }
            });
            return res.json(org);
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "Organization not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Delete an organization.
     */
    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.organization.delete({
                where: { id }
            });
            return res.status(204).send();
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "Organization not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }
}

export default OrganizationController;
