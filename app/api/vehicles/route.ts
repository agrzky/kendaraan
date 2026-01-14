import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Authentication is handled by middleware, but we can get user info from headers
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    // Optional: Filter vehicles based on user role
    // Admin can see all, regular users only see their own
    const whereClause = userRole === 'admin' ? {} : { ownerId: userId || undefined }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, vehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    const data = await request.json()

    // Use the ownerId from request if admin, otherwise use current user
    const ownerId = userRole === 'admin' && data.ownerId 
      ? data.ownerId 
      : userId

    if (!ownerId) {
      return NextResponse.json(
        { success: false, error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        licensePlate: data.licensePlate,
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year),
        fuelType: data.type || data.fuelType || null,
        ownerId: ownerId,
        status: data.status || 'active',
        // Service fields
        lastServiceDate: data.lastService || data.lastServiceDate ? new Date(data.lastService || data.lastServiceDate) : null,
        nextServiceDate: data.nextService || data.nextServiceDate ? new Date(data.nextService || data.nextServiceDate) : null,
        lastServiceKm: data.lastServiceKm ? parseInt(data.lastServiceKm) : null,
        nextServiceKm: data.nextServiceKm ? parseInt(data.nextServiceKm) : null,
        // Tax field
        taxExpireDate: data.taxExpireDate ? new Date(data.taxExpireDate) : null,
      },
    })

    return NextResponse.json({ success: true, vehicle })
  } catch (error: unknown) {
    console.error('❌ Error creating vehicle:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = (error as { code?: string })?.code
    const errorMeta = (error as { meta?: unknown })?.meta
    
    console.error('Error details:', {
      message: errorMessage,
      code: errorCode,
      meta: errorMeta,
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create vehicle',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}
