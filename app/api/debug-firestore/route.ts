import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/api/firebase-config"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    // Test Firebase configuration
    const debugInfo = {
      hasApp: !!db,
      hasDb: !!db,
      hasRealConfig: process.env.FIREBASE_PROJECT_ID !== "mock-project-id",
      projectId: process.env.FIREBASE_PROJECT_ID || "not-set",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "not-set",
      envVars: {
        FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: !!process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: !!process.env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: !!process.env.FIREBASE_APP_ID,
      },
    }

    // Test read operation
    let readTest
    try {
      const querySnapshot = await getDocs(collection(db, "debug-test"))
      const documents: any[] = []
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      readTest = {
        success: true,
        documentsFound: documents.length,
        documents,
      }
    } catch (error: any) {
      readTest = {
        success: false,
        error: error.message,
      }
    }

    return NextResponse.json({
      success: true,
      debugInfo,
      readTest,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test write operation
    const testData = {
      message: "Debug test document",
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, "debug-test"), testData)

    return NextResponse.json({
      success: true,
      debugInfo: {
        hasApp: !!db,
        hasDb: !!db,
        hasRealConfig: process.env.FIREBASE_PROJECT_ID !== "mock-project-id",
        projectId: process.env.FIREBASE_PROJECT_ID || "not-set",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "not-set",
        envVars: {
          FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
          FIREBASE_AUTH_DOMAIN: !!process.env.FIREBASE_AUTH_DOMAIN,
          FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
          FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
          FIREBASE_MESSAGING_SENDER_ID: !!process.env.FIREBASE_MESSAGING_SENDER_ID,
          FIREBASE_APP_ID: !!process.env.FIREBASE_APP_ID,
        },
      },
      writeTest: {
        success: true,
        documentId: docRef.id,
        data: {
          message: testData.message,
          timestamp: {
            _methodName: "serverTimestamp",
          },
          createdAt: testData.createdAt,
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
