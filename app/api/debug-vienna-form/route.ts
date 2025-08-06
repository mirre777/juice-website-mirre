import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Vienna form submission:', {
      timestamp: new Date().toISOString(),
      data: body
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: body
    })
  } catch (error) {
    console.error('Vienna form submission error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process form submission' 
      },
      { status: 500 }
    )
  }
}
