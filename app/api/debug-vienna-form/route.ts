import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the form submission for debugging
    console.log('Vienna form submission:', {
      timestamp: new Date().toISOString(),
      city: body.city,
      name: body.name,
      email: body.email,
      goal: body.goal,
      district: body.district,
      startDate: body.startDate,
      message: body.message,
      source: body.source
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Formular erfolgreich übermittelt! Wir melden uns bald bei dir.',
      data: {
        submittedAt: new Date().toISOString(),
        city: 'Wien',
        name: body.name
      }
    })

  } catch (error) {
    console.error('Vienna form submission error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fehler beim Verarbeiten des Formulars',
        message: 'Es gab einen technischen Fehler. Bitte versuche es erneut.'
      },
      { status: 500 }
    )
  }
}
