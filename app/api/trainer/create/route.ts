import { NextRequest, NextResponse } from 'next/server'
import { TrainerService } from '@/lib/firebase-trainer'

export async function POST(request: NextRequest) {
  console.log('🚀 [TRAINER CREATE API] Starting request processing...')
  
  try {
    console.log('📥 [TRAINER CREATE API] Parsing request body...')
    const body = await request.json()
    
    console.log('✅ [TRAINER CREATE API] Request body parsed successfully:', {
      hasFullName: !!body.fullName,
      hasEmail: !!body.email,
      hasPhone: !!body.phone,
      hasCity: !!body.city,
      hasDistrict: !!body.district,
      hasSpecialty: !!body.specialty,
      hasCertifications: !!body.certifications,
      hasBio: !!body.bio,
      servicesCount: body.services?.length || 0,
      fullBody: JSON.stringify(body, null, 2)
    })
    
    // Validate required fields
    console.log('🔍 [TRAINER CREATE API] Validating required fields...')
    const requiredFields = ['fullName', 'email', 'city', 'district', 'specialty']
    const missingFields = requiredFields.filter(field => !body[field]?.trim())
    
    if (missingFields.length > 0) {
      console.log('❌ [TRAINER CREATE API] Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    console.log('✅ [TRAINER CREATE API] Required fields validation passed')
    
    // Validate email format
    console.log('🔍 [TRAINER CREATE API] Validating email format...')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      console.log('❌ [TRAINER CREATE API] Invalid email format:', body.email)
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    console.log('✅ [TRAINER CREATE API] Email format validation passed')
    
    // Prepare trainer data
    console.log('📋 [TRAINER CREATE API] Preparing trainer data...')
    const trainerData = {
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      city: body.city.trim(),
      district: body.district.trim(),
      specialty: body.specialty.trim(),
      certifications: body.certifications?.trim() || '',
      bio: body.bio?.trim() || '',
      services: body.services || [],
      status: 'pending'
    }
    
    console.log('✅ [TRAINER CREATE API] Trainer data prepared successfully:', JSON.stringify(trainerData, null, 2))
    
    // Create temp trainer
    console.log('🚀 [TRAINER CREATE API] Calling TrainerService.createTempTrainer...')
    const result = await TrainerService.createTempTrainer(trainerData)
    
    console.log('🎉 [TRAINER CREATE API] Trainer created successfully:', JSON.stringify(result, null, 2))
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('💥 [TRAINER CREATE API] Error processing request:', error)
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available'
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      type: typeof error,
      constructor: error?.constructor?.name
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
