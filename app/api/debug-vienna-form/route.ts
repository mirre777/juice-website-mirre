import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the form submission for debugging
    console.log('Vienna Form Submission:', {
      timestamp: new Date().toISOString(),
      city: 'Wien',
      data: body
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real application, you would:
    // 1. Validate the data
    // 2. Save to database
    // 3. Send confirmation email
    // 4. Trigger trainer matching logic

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      city: 'Wien'
    })
  } catch (error) {
    console.error('Error processing Vienna form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process form submission' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Vienna form debug endpoint',
    city: 'Wien',
    status: 'active'
  })
}
