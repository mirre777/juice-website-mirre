import { type NextRequest, NextResponse } from "next/server"
import { db, getFirebaseDebugInfo } from "@/app/api/firebase-config"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const debugInfo = getFirebaseDebugInfo()

    // Test reading from trainers collection
    let readTest = null
    try {
      const trainersRef = collection(db, "trainers")
      const snapshot = await getDocs(trainersRef)
      readTest = {
        success: true,
        count: snapshot.size,
        docs: snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
          exists: doc.exists(),
        })),
      }
    } catch (readError) {
      readTest = {
        success: false,
        error: readError instanceof Error ? readError.message : String(readError),
      }
    }

    return NextResponse.json({
      firebaseConfig: debugInfo,
      firestoreRead: readTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test writing to trainers collection
    const testData = {
      testField: "test value",
      createdAt: serverTimestamp(),
      timestamp: new Date().toISOString(),
      source: "debug-endpoint",
    }

    const docRef = await addDoc(collection(db, "trainers"), testData)

    return NextResponse.json({
      success: true,
      docId: docRef.id,
      testData: {
        ...testData,
        createdAt: "[ServerTimestamp]", // Don't serialize the actual timestamp
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any)?.code || "unknown",
      },
      { status: 500 },
    )
  }
}
