import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
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
    })

    if (!maintenance) {
      return NextResponse.json(
        { success: false, error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    // Check permission
    if (userRole !== 'admin' && maintenance.vehicle.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view this record' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, maintenance })
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maintenance record' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const data = await request.json()

    // First, check permission
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: { ownerId: true }
        }
      }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { success: false, error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    if (userRole !== 'admin' && existingMaintenance.vehicle.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to edit this record' },
        { status: 403 }
      )
    }

    // Build update data object - only include fields that were explicitly sent
    const updateData: Record<string, any> = {}
    
    if (data.type !== undefined) updateData.type = data.type
    if (data.description !== undefined) updateData.description = data.description
    if (data.cost !== undefined) updateData.cost = data.cost !== null ? parseFloat(data.cost) : null
    if (data.mileage !== undefined) updateData.mileage = data.mileage !== null ? parseInt(data.mileage) : null
    if (data.maintenanceDate !== undefined) updateData.maintenanceDate = data.maintenanceDate ? new Date(data.maintenanceDate) : undefined
    if (data.nextServiceDate !== undefined) updateData.nextServiceDate = data.nextServiceDate ? new Date(data.nextServiceDate) : null
    if (data.workshop !== undefined) updateData.workshop = data.workshop
    if (data.technician !== undefined) updateData.technician = data.technician
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.status !== undefined) updateData.status = data.status

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, maintenance })
  } catch (error) {
    console.error('Error updating maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update maintenance record' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    // First, check permission
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: { ownerId: true }
        }
      }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { success: false, error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    if (userRole !== 'admin' && existingMaintenance.vehicle.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this record' },
        { status: 403 }
      )
    }

    await prisma.maintenance.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete maintenance record' },
      { status: 500 }
    )
  }
}
