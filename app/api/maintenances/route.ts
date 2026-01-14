import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    // Get vehicle IDs for this user (for filtering maintenances)
    let whereClause = {}
    
    if (userRole !== 'admin') {
      const userVehicleIds = (await prisma.vehicle.findMany({
        where: { ownerId: userId || undefined },
        select: { id: true }
      })).map(v => v.id)
      
      whereClause = { vehicleId: { in: userVehicleIds } }
    }

    const maintenances = await prisma.maintenance.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            brand: true,
            model: true,
            ownerId: true,
          },
        },
      },
      orderBy: {
        maintenanceDate: 'desc',
      },
    })

    return NextResponse.json({ success: true, maintenances })
  } catch (error) {
    console.error('Error fetching maintenances:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maintenances' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const data = await request.json()

    // Verify that the user owns the vehicle (or is admin)
    if (userRole !== 'admin') {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
        select: { ownerId: true }
      })

      if (!vehicle || vehicle.ownerId !== userId) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to add maintenance to this vehicle' },
          { status: 403 }
        )
      }
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        vehicleId: data.vehicleId,
        type: data.type,
        description: data.description,
        cost: data.cost !== undefined && data.cost !== null && data.cost !== '' 
          ? (typeof data.cost === 'number' ? data.cost : parseFloat(data.cost))
          : null,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        maintenanceDate: new Date(data.maintenanceDate),
        nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate) : null,
        workshop: data.workshop,
        technician: data.technician,
        notes: data.notes,
        status: data.status || 'pending',
      },
    })

    return NextResponse.json({ success: true, maintenance })
  } catch (error) {
    console.error('Error creating maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create maintenance record' },
      { status: 500 }
    )
  }
}
