import { type NextRequest, NextResponse } from "next/server"
import { db, getFirebaseDebugInfo } from "@/app/api/firebase-config"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const debugInfo = getFirebaseDebugInfo()

    // Test reading from Firestore
    const testCollection = collection(db, "debug-test")
    const snapshot = await getDocs(testCollection)

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))

    return NextResponse.json({
      success: true,
      debugInfo,
      readTest: {
        success: true,
        documentsFound: docs.length,
        documents: docs,
      },
    })
  } catch (error) {
    console.error("Debug read test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      debugInfo: getFirebaseDebugInfo(),
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const debugInfo = getFirebaseDebugInfo()

    // Test writing to Firestore
    const testCollection = collection(db, "debug-test")
    const testData = {
      message: "Debug test document",
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    }

    const docRef = await addDoc(testCollection, testData)

    return NextResponse.json({
      success: true,
      debugInfo,
      writeTest: {
        success: true,
        documentId: docRef.id,
        data: testData,
      },
    })
  } catch (error) {
    console.error("Debug write test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      debugInfo: getFirebaseDebugInfo(),
    })
  }
}
