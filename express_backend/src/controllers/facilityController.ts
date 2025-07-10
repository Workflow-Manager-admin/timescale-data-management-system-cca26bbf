import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Controller for Facility entity.
 */
export class FacilityController {
    // PUBLIC_INTERFACE
    /**
     * Create a new facility for an organization.
     */
    static async create(req: Request, res: Response) {
        try {
            const { name, description, organizationId } = req.body;
            const facility = await prisma.facility.create({
                data: { name, description, organizationId }
            });
            return res.status(201).json(facility);
        } catch (err: any) {
            if (err.code === 'P2002') {
                return res.status(409).json({ message: "Facility with this name already exists for the organization." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get all facilities.
     */
    static async findAll(req: Request, res: Response) {
        try {
            const facilities = await prisma.facility.findMany({
                include: { organization: true, fillEvents: true }
            });
            return res.json(facilities);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Get one facility by ID.
     */
    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const facility = await prisma.facility.findUnique({
                where: { id },
                include: { organization: true, fillEvents: true }
            });
            if (!facility) return res.status(404).json({ message: "Facility not found." });
            return res.json(facility);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Update a facility.
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, organizationId } = req.body;
            const facility = await prisma.facility.update({
                where: { id },
                data: { name, description, organizationId }
            });
            return res.json(facility);
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "Facility not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }

    // PUBLIC_INTERFACE
    /**
     * Delete a facility.
     */
    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.facility.delete({
                where: { id }
            });
            return res.status(204).send();
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).json({ message: "Facility not found." });
            }
            return res.status(500).json({ error: err.message });
        }
    }
}

export default FacilityController;
