import { type NextRequest, NextResponse } from "next/server"
import { db, getFirebaseDebugInfo } from "@/app/api/firebase-config"
import { collection, addDoc, getDocs, serverTimestamp, Timestamp } from "firebase/firestore"

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
        docs: snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            data: {
              ...data,
              // Convert Firestore Timestamps to strings for JSON serialization
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
              expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate().toISOString() : data.expiresAt,
            },
            exists: doc.exists(),
          }
        }),
      }
    } catch (readError) {
      readTest = {
        success: false,
        error: readError instanceof Error ? readError.message : String(readError),
        code: (readError as any)?.code || "unknown",
      }
    }

    return NextResponse.json({
      firebaseConfig: debugInfo,
      firestoreRead: readTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug GET error:", error)
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
    console.log("Debug POST: Starting write test...")

    // Test writing to trainers collection with proper data serialization
    const testData = {
      testField: "test value",
      createdAt: serverTimestamp(),
      timestamp: new Date().toISOString(),
      source: "debug-endpoint",
      testNumber: 42,
      testBoolean: true,
      testArray: ["item1", "item2", "item3"],
      testObject: {
        nested: "value",
        number: 123,
      },
    }

    console.log("Debug POST: Test data prepared:", {
      ...testData,
      createdAt: "[ServerTimestamp]",
    })

    const trainersCollection = collection(db, "trainers")
    console.log("Debug POST: Collection reference created")

    const docRef = await addDoc(trainersCollection, testData)
    console.log("Debug POST: Document created successfully:", docRef.id)

    return NextResponse.json({
      success: true,
      docId: docRef.id,
      testData: {
        ...testData,
        createdAt: "[ServerTimestamp]", // Don't serialize the actual timestamp
      },
    })
  } catch (error) {
    console.error("Debug POST error:", error)
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
