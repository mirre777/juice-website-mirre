"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"

export default function FirebaseRulesPage() {
  const [copied, setCopied] = useState(false)

  const firebaseRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users for all collections
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Alternatively, you can use more specific rules:
    match /potential_users/{userId} {
      allow read, write: if true;
    }
    
    match /users/{userId} {
      allow read, write: if true;
      
      match /profile/{document} {
        allow read, write: if true;
      }
      
      match /notifications/{document} {
        allow read, write: if true;
      }
    }
    
    match /status_transitions/{document} {
      allow read, write: if true;
    }
  }
}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(firebaseRules)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/user-management" className="inline-flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Firebase Security Rules</h1>
          <p className="text-zinc-400 max-w-3xl mb-8">
            You need to update your Firebase security rules to allow writing to the users collection.
          </p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Required Security Rules</h2>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Rules
                </>
              )}
            </Button>
          </div>

          <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">{firebaseRules}</pre>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">How to Update Your Rules</h3>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300">
              <li>
                Go to the{" "}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-juice hover:underline"
                >
                  Firebase Console
                </a>
              </li>
              <li>
                Select your project: <strong>juice-coaching-web-app</strong>
              </li>
              <li>
                In the left sidebar, click on <strong>Firestore Database</strong>
              </li>
              <li>
                Click on the <strong>Rules</strong> tab
              </li>
              <li>Replace the existing rules with the ones above</li>
              <li>
                Click <strong>Publish</strong>
              </li>
            </ol>

            <div className="bg-yellow-900/20 text-yellow-300 p-4 rounded-lg mt-6">
              <p className="font-medium">⚠️ Security Warning</p>
              <p className="mt-2 text-sm">
                These rules allow unrestricted read and write access to your database. This is fine for development but
                should be replaced with proper authentication rules before going to production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
