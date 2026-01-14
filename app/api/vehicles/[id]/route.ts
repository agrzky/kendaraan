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

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        maintenances: {
          orderBy: {
            maintenanceDate: 'desc',
          },
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this vehicle
    if (userRole !== 'admin' && vehicle.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view this vehicle' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
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

    // First, check if vehicle exists and user has permission
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id },
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to edit this vehicle
    if (userRole !== 'admin' && existingVehicle.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to edit this vehicle' },
        { status: 403 }
      )
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        licensePlate: data.licensePlate,
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year),
        fuelType: data.fuelType,
        status: data.status,
        // Service fields
        lastServiceDate: data.lastServiceDate ? new Date(data.lastServiceDate) : null,
        nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate) : null,
        lastServiceKm: data.lastServiceKm ? parseInt(data.lastServiceKm) : null,
        nextServiceKm: data.nextServiceKm ? parseInt(data.nextServiceKm) : null,
        // Tax field
        taxExpireDate: data.taxExpireDate ? new Date(data.taxExpireDate) : null,
      },
    })

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle' },
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

    // First, check if vehicle exists and user has permission
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id },
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Only admin can delete any vehicle, users can only delete their own
    if (userRole !== 'admin' && existingVehicle.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this vehicle' },
        { status: 403 }
      )
    }

    await prisma.vehicle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}
