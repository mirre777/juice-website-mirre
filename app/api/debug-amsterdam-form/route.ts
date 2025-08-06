import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the form submission
    console.log('Amsterdam form submission:', {
      timestamp: new Date().toISOString(),
      city: 'Amsterdam',
      data: body
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: body
    })

  } catch (error) {
    console.error('Amsterdam form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
