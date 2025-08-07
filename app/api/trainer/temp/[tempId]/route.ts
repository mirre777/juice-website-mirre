import { NextRequest, NextResponse } from 'next/server'
import { TrainerService } from '@/lib/firebase-trainer'

export async function GET(
  request: NextRequest,
  { params }: { params: { tempId: string } }
) {
  console.log('🔥 [TEMP TRAINER API] Getting temp trainer:', params.tempId)
  
  try {
    const trainer = await TrainerService.getTempTrainer(params.tempId)
    
    if (!trainer) {
      console.log('❌ [TEMP TRAINER API] Trainer not found')
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ [TEMP TRAINER API] Trainer found:', JSON.stringify(trainer, null, 2))
    
    return NextResponse.json({
      success: true,
      trainer,
      content: null // Will be generated on frontend
    })
    
  } catch (error) {
    console.error('💥 [TEMP TRAINER API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tempId: string } }
) {
  console.log('🔥 [TEMP TRAINER API] Updating temp trainer:', params.tempId)
  
  try {
    const body = await request.json()
    const { content } = body
    
    await TrainerService.updateTempTrainer(params.tempId, { content })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('💥 [TEMP TRAINER API] Error updating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
