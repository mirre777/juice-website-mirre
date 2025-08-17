"use client"

import { useState, useEffect } from "react"
import { db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function TestFirebase() {
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const testWriteDatabase = async () => {
    try {
      const testData = {
        email: "test@example.com",
        message: "Test message from website",
        createdAt: serverTimestamp(),
        status: "waitlist",
        source: "website_waitlist",
        fromWaitlist: true,
        user_type: "client", // Use user_type instead of role
        plan: "basic", // Standardized plan value
        signUpDate: new Date().toISOString(),
        origin: origin,
      }

      const docRef = await addDoc(collection(db, "test_data"), testData)
      console.log("Document written with ID: ", docRef.id)
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }

  return (
    <div>
      <h1>Test Firebase</h1>
      <button onClick={testWriteDatabase}>Write to Database</button>
    </div>
  )
}
