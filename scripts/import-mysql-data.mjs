/**
 * Import Data to MySQL
 * 
 * Script ini akan mengimport data dari file JSON export ke MySQL.
 * 
 * Jalankan dengan: node scripts/import-mysql-data.mjs
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

async function importData() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ DATABASE_URL tidak ditemukan!')
    process.exit(1)
  }

  console.log('🔌 CONNECTION:', connectionString.replace(/:([^@]+)@/, ':***@'))

  // Find the latest export file
  const exportDir = path.join(process.cwd(), 'exports')
  if (!fs.existsSync(exportDir)) {
    console.error('❌ Folder exports tidak ditemukan!')
    process.exit(1)
  }

  const files = fs.readdirSync(exportDir).filter(f => f.startsWith('supabase-export-') && f.endsWith('.json'))
  if (files.length === 0) {
    console.error('❌ Tidak ada file export ditemukan!')
    process.exit(1)
  }

  const latestFile = files.sort().reverse()[0]
  const exportPath = path.join(exportDir, latestFile)
  
  console.log(`📄 Menggunakan file: ${latestFile}`)

  const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'))
  const { users, vehicles, maintenances } = exportData.data

  console.log('🔌 Menghubungkan ke MySQL...')

  // Create adapter with connection string (convert mysql:// to mariadb://)
  // Also fix empty password format: root:@ -> root@
  let mariadbUrl = connectionString.replace('mysql://', 'mariadb://')
  mariadbUrl = mariadbUrl.replace(':@', '@') // Fix empty password format
  console.log('   URL:', mariadbUrl.replace(/:([^@]+)@/, ':***@'))
  const adapter = new PrismaMariaDb(mariadbUrl)
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('📥 Mengimport data...\n')

    // Import Users
    console.log(`👤 Mengimport ${users.length} user...`)
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          name: user.name,
          password: user.password,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      })
    }
    console.log('   ✓ Users imported')

    // Import Vehicles
    console.log(`🚗 Mengimport ${vehicles.length} vehicle...`)
    for (const vehicle of vehicles) {
      await prisma.vehicle.upsert({
        where: { id: vehicle.id },
        update: {
          licensePlate: vehicle.licensePlate,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          fuelType: vehicle.fuelType,
          ownerId: vehicle.ownerId,
          status: vehicle.status,
          lastServiceDate: vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate) : null,
          nextServiceDate: vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate) : null,
          lastServiceKm: vehicle.lastServiceKm,
          nextServiceKm: vehicle.nextServiceKm,
          taxExpireDate: vehicle.taxExpireDate ? new Date(vehicle.taxExpireDate) : null,
          createdAt: new Date(vehicle.createdAt),
          updatedAt: new Date(vehicle.updatedAt),
        },
        create: {
          id: vehicle.id,
          licensePlate: vehicle.licensePlate,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          fuelType: vehicle.fuelType,
          ownerId: vehicle.ownerId,
          status: vehicle.status,
          lastServiceDate: vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate) : null,
          nextServiceDate: vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate) : null,
          lastServiceKm: vehicle.lastServiceKm,
          nextServiceKm: vehicle.nextServiceKm,
          taxExpireDate: vehicle.taxExpireDate ? new Date(vehicle.taxExpireDate) : null,
          createdAt: new Date(vehicle.createdAt),
          updatedAt: new Date(vehicle.updatedAt),
        },
      })
    }
    console.log('   ✓ Vehicles imported')

    // Import Maintenances
    console.log(`🔧 Mengimport ${maintenances.length} maintenance...`)
    for (const maintenance of maintenances) {
      await prisma.maintenance.upsert({
        where: { id: maintenance.id },
        update: {
          vehicleId: maintenance.vehicleId,
          type: maintenance.type,
          description: maintenance.description,
          cost: maintenance.cost,
          mileage: maintenance.mileage,
          status: maintenance.status,
          maintenanceDate: new Date(maintenance.maintenanceDate),
          nextServiceDate: maintenance.nextServiceDate ? new Date(maintenance.nextServiceDate) : null,
          workshop: maintenance.workshop,
          technician: maintenance.technician,
          notes: maintenance.notes,
          createdAt: new Date(maintenance.createdAt),
          updatedAt: new Date(maintenance.updatedAt),
        },
        create: {
          id: maintenance.id,
          vehicleId: maintenance.vehicleId,
          type: maintenance.type,
          description: maintenance.description,
          cost: maintenance.cost,
          mileage: maintenance.mileage,
          status: maintenance.status,
          maintenanceDate: new Date(maintenance.maintenanceDate),
          nextServiceDate: maintenance.nextServiceDate ? new Date(maintenance.nextServiceDate) : null,
          workshop: maintenance.workshop,
          technician: maintenance.technician,
          notes: maintenance.notes,
          createdAt: new Date(maintenance.createdAt),
          updatedAt: new Date(maintenance.updatedAt),
        },
      })
    }
    console.log('   ✓ Maintenances imported')

    console.log('\n✅ Import berhasil!')
    console.log('\n📊 Ringkasan:')
    console.log(`   - Users: ${users.length}`)
    console.log(`   - Vehicles: ${vehicles.length}`)
    console.log(`   - Maintenances: ${maintenances.length}`)

  } catch (error) {
    console.error('❌ Error saat import:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Koneksi ditutup.')
  }
}

importData()
