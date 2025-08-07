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
      fullBody: body
    })

    // Validate required fields
    console.log('🔍 [TRAINER CREATE API] Validating required fields...')
    const requiredFields = ['fullName', 'email', 'city', 'district', 'specialty']
    const missingFields = requiredFields.filter(field => !body[field]?.trim())
    
    if (missingFields.length > 0) {
      console.log('❌ [TRAINER CREATE API] Missing required fields:', missingFields)
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
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
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }
    console.log('✅ [TRAINER CREATE API] Email format validation passed')

    // Validate city and district
    console.log('🔍 [TRAINER CREATE API] Validating city and district...')
    if (body.city.trim().length < 2 || body.district.trim().length < 2) {
      console.log('❌ [TRAINER CREATE API] City or district too short')
      return NextResponse.json(
        { success: false, error: 'City and district must be at least 2 characters long' },
        { status: 400 }
      )
    }
    console.log('✅ [TRAINER CREATE API] City and district validation passed')

    // Prepare trainer data
    const trainerData = {
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      city: body.city.trim(),
      district: body.district.trim(),
      specialty: body.specialty.trim(),
      certifications: body.certifications?.trim() || '',
      bio: body.bio?.trim() || '',
      services: Array.isArray(body.services) ? body.services : [],
      status: 'pending'
    }

    console.log('📋 [TRAINER CREATE API] Prepared trainer data:', trainerData)

    // Check TrainerService availability
    console.log('🔍 [TRAINER CREATE API] Checking TrainerService availability...')
    if (!TrainerService) {
      console.log('❌ [TRAINER CREATE API] TrainerService not available')
      throw new Error('TrainerService not available')
    }
    console.log('✅ [TRAINER CREATE API] TrainerService is available')

    console.log('🔍 [TRAINER CREATE API] Checking createTempTrainer method...')
    if (typeof TrainerService.createTempTrainer !== 'function') {
      console.log('❌ [TRAINER CREATE API] createTempTrainer method not available')
      throw new Error('createTempTrainer method not available')
    }
    console.log('✅ [TRAINER CREATE API] createTempTrainer method is available')

    // Create temp trainer
    console.log('🚀 [TRAINER CREATE API] Calling TrainerService.createTempTrainer...')
    const result = await TrainerService.createTempTrainer(trainerData)
    console.log('✅ [TRAINER CREATE API] TrainerService.createTempTrainer completed:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('💥 [TRAINER CREATE API] Error occurred:')
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Full error object:', error)

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? {
          type: typeof error,
          constructor: error?.constructor?.name,
          stack: error instanceof Error ? error.stack : undefined
        } : undefined
      },
      { status: 500 }
    )
  }
}
