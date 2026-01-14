/**
 * Prisma 7 Configuration
 * This file exports database connection URLs for migrations and client initialization
 */
import 'dotenv/config'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
