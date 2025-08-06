import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the submission for debugging
    console.log('Amsterdam form submission:', {
      timestamp: new Date().toISOString(),
      data: body
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Amsterdam form submitted successfully',
      data: body
    })

  } catch (error) {
    console.error('Amsterdam form submission error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process Amsterdam form submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
