import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    const whereClause = userRole === 'admin' 
      ? {} 
      : { 
          vehicle: {
            ownerId: userId || undefined
          }
        }

    const records = await prisma.tollRecord.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            brand: true,
            model: true,
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, records })
  } catch (error) {
    console.error('Error fetching toll records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch toll records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.vehicleId || !data.date || !data.cost) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    const record = await prisma.tollRecord.create({
      data: {
        vehicleId: data.vehicleId,
        date: new Date(data.date),
        driver: data.driver,
        cost: parseFloat(data.cost),
        remarks: data.remarks,
        receiptUrl: data.receiptUrl,
      },
    })

    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error('Error creating toll record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create record' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required' },
        { status: 400 }
      )
    }

    const record = await prisma.tollRecord.update({
      where: { id: data.id },
      data: {
        date: new Date(data.date),
        driver: data.driver,
        cost: parseFloat(data.cost),
        remarks: data.remarks,
      },
    })

    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error('Error updating toll record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update record' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required' },
        { status: 400 }
      )
    }

    await prisma.tollRecord.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Record deleted' })
  } catch (error) {
    console.error('Error deleting toll record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 }
    )
  }
}
