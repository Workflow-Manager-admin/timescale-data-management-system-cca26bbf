import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// PUBLIC_INTERFACE
/**
 * Loads environment variables from .env (including DATABASE_URL) and exports a singleton PrismaClient instance.
 * Ensures the correct TimescaleDB connection for the backend using Prisma with .env configuration.
 */
dotenv.config();

const prisma = new PrismaClient();

export default prisma;
