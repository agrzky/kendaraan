import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is available
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set!')
}

// Create the Prisma adapter using the connection string directly
// MariaDB adapter requires mariadb:// protocol, so we convert from mysql://
// Also fix empty password format: root:@ -> root@
const mariadbUrl = connectionString
  ?.replace('mysql://', 'mariadb://')
  ?.replace(':@', '@') // Fix empty password format
const adapter = mariadbUrl ? new PrismaMariaDb(mariadbUrl) : undefined

// Initialize Prisma Client with the adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

// Cache the Prisma client in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
