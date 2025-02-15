"use client"

import { useState } from "react"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth, db } from "@/app/config/firebase-config"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false) // ✅ Track loading state
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSignIn = async () => {
    setIsSigningIn(true) // ✅ Set loading state to true
    try {
      const res = await signInWithEmailAndPassword(email, password)
      if (!res || !res.user) {
        alert("Sign-in failed. Please try again.")
        setIsSigningIn(false)
        return
      }

      const userId = res.user.uid // ✅ Get user ID from Firebase Auth

      // ✅ Fetch user data from Firestore
      const userDocRef = doc(db, "users", userId)
      const userDocSnap = await getDoc(userDocRef)

      if (!userDocSnap.exists()) {
        alert("User data not found. Please contact support.")
        setIsSigningIn(false)
        return
      }

      const userData = userDocSnap.data()

      // ✅ Store user details in localStorage
      const currentUser = {
        id: userId,
        userName: userData.userName,
        email: res.user.email,
        avatar: userData.avatar || "/placeholder.svg?height=40&width=40", // Default avatar if missing
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      // ✅ Manually trigger storage event to update navbar immediately
      window.dispatchEvent(new Event("storage"))

      console.log("User Signed In:", currentUser)

      // ✅ Redirect to home page
      router.push("/")

    } catch (e) {
      console.error("Sign-in Error:", e)
      alert("Failed to sign in. Please check your credentials.")
    } finally {
      setIsSigningIn(false) // ✅ Reset loading state after sign-in attempt
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          disabled={isSigningIn} // ✅ Disable input when signing in
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          disabled={isSigningIn} // ✅ Disable input when signing in
        />
        <button
          onClick={handleSignIn}
          className={`w-full p-3 rounded text-white ${
            isSigningIn ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
          }`}
          disabled={isSigningIn} // ✅ Disable button while signing in
        >
          {isSigningIn ? "Signing In..." : "Sign In"} {/* ✅ Change button text while signing in */}
        </button>
      </div>
    </div>
  )
}

export default SignIn
