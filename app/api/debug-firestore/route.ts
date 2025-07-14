import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { collection, addDoc, getDocs, query, limit, serverTimestamp, Timestamp } from "firebase/firestore"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    if (action === "read") {
      // Test reading from Firestore
      const trainersRef = collection(db, "trainers")
      const q = query(trainersRef, limit(5))
      const querySnapshot = await getDocs(q)

      const docs = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        // Convert Firestore Timestamps to ISO strings for JSON serialization
        const serializedData = Object.keys(data).reduce((acc, key) => {
          const value = data[key]
          if (value instanceof Timestamp) {
            acc[key] = value.toDate().toISOString()
          } else {
            acc[key] = value
          }
          return acc
        }, {} as any)

        return {
          id: doc.id,
          data: serializedData,
        }
      })

      return NextResponse.json({
        success: true,
        message: `Successfully read ${docs.length} documents from trainers collection`,
        docs,
      })
    } else if (action === "write") {
      // Test writing to Firestore
      const testData = {
        testField: "debug-test-value",
        createdAt: serverTimestamp(),
        timestamp: new Date(),
        number: 42,
        boolean: true,
        array: ["item1", "item2"],
        object: { nested: "value" },
      }

      const docRef = await addDoc(collection(db, "debug_tests"), testData)

      return NextResponse.json({
        success: true,
        message: "Successfully wrote test document to Firestore",
        docId: docRef.id,
        testData: {
          ...testData,
          createdAt: "[serverTimestamp]", // Can't serialize serverTimestamp
          timestamp: testData.timestamp.toISOString(),
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use ?action=read or ?action=write",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Debug Firestore error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
