import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering to get real-time data from database
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // User info is injected by middleware
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    // Get start of current month for completed this month query
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Get 6 months ago for monthly trend
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    // Build where clause based on role
    // Admin sees all, users see only their vehicles
    const vehicleWhereClause = userRole === 'admin' ? {} : { ownerId: userId || undefined }
    
    // Get vehicle IDs for this user (for filtering maintenances)
    const userVehicleIds = userRole === 'admin' 
      ? undefined  // Admin sees all
      : (await prisma.vehicle.findMany({
          where: { ownerId: userId || undefined },
          select: { id: true }
        })).map(v => v.id)

    const maintenanceWhereClause = userRole === 'admin' 
      ? {} 
      : { vehicleId: { in: userVehicleIds } }

    // Execute all queries in parallel for maximum performance
    const [
      totalVehicles,
      activeVehicles,
      pendingServices,
      inProgressServices,
      completedServices,
      completedThisMonth,
      totalMaintenances,
      maintenancesByStatus,
      monthlyMaintenances,
      recentMaintenances,
      vehiclesByFuelType,
    ] = await Promise.all([
      // Vehicle counts (filtered by role)
      prisma.vehicle.count({ where: vehicleWhereClause }),
      prisma.vehicle.count({ where: { ...vehicleWhereClause, status: 'active' } }),

      // Maintenance counts by status (filtered by role)
      prisma.maintenance.count({ where: { ...maintenanceWhereClause, status: 'pending' } }),
      prisma.maintenance.count({ where: { ...maintenanceWhereClause, status: 'in-progress' } }),
      prisma.maintenance.count({ where: { ...maintenanceWhereClause, status: 'completed' } }),
      prisma.maintenance.count({
        where: {
          ...maintenanceWhereClause,
          status: 'completed',
          maintenanceDate: { gte: startOfMonth }
        }
      }),
      prisma.maintenance.count({ where: maintenanceWhereClause }),

      // Grouped queries
      prisma.maintenance.groupBy({
        by: ['status'],
        where: maintenanceWhereClause,
        _count: { status: true }
      }),
      prisma.maintenance.groupBy({
        by: ['maintenanceDate'],
        where: { 
          ...maintenanceWhereClause,
          maintenanceDate: { gte: sixMonthsAgo } 
        },
        _count: { id: true }
      }),

      // Recent maintenances with vehicle info
      prisma.maintenance.findMany({
        where: maintenanceWhereClause,
        take: 5,
        orderBy: { maintenanceDate: 'desc' },
        include: {
          vehicle: {
            select: {
              licensePlate: true,
              brand: true,
              model: true
            }
          }
        }
      }),

      // Vehicle type distribution
      prisma.vehicle.groupBy({
        by: ['fuelType'],
        where: vehicleWhereClause,
        _count: { fuelType: true }
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalVehicles,
          activeVehicles,
          totalMaintenances,
          pendingServices,
          inProgressServices,
          completedServices,
          completedThisMonth,
        },
        maintenancesByStatus,
        monthlyMaintenances,
        recentMaintenances,
        vehiclesByFuelType,
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
