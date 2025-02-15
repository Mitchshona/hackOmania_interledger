"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth, storage, db } from "@/app/config/firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, doc, setDoc } from "firebase/firestore"

const SignUp = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false) // ✅ Track loading state
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0])
    }
  }

  const handleSignUp = async () => {
    setIsSigningUp(true) // ✅ Set loading state to true
    try {
      if (!email || !password || !userName) {
        alert("Please enter a username, email, and password.")
        setIsSigningUp(false)
        return
      }

      const userCredential = await createUserWithEmailAndPassword(email, password)
      if (!userCredential) {
        alert("Signup failed. Please try again.")
        setIsSigningUp(false)
        return
      }

      const newUser = userCredential.user
      let avatarUrl = ""

      if (avatar) {
        const avatarRef = ref(storage, `avatars/${newUser.uid}`)
        await uploadBytes(avatarRef, avatar)
        avatarUrl = await getDownloadURL(avatarRef)
      }

      const userData = {
        id: newUser.uid,
        userName: userName,
        email: newUser.email,
        avatar: avatarUrl,
        createdAt: new Date(),
        streaks: 0,
        days: 0
      }

      await setDoc(doc(collection(db, "users"), newUser.uid), userData)

      // ✅ Save user data to localStorage
      localStorage.setItem("currentUser", JSON.stringify(userData))

      // ✅ Trigger navbar update
      window.dispatchEvent(new Event("storage"))

      console.log("User Signed Up:", userData)

      // ✅ Redirect after successful signup
      router.push("/")

    } catch (e) {
      console.error("Signup Error:", e)
      alert("Failed to sign up. Please try again.")
    } finally {
      setIsSigningUp(false) // ✅ Reset loading state after signup attempt
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          disabled={isSigningUp}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          disabled={isSigningUp}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          disabled={isSigningUp}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          disabled={isSigningUp}
        />
        <button
          onClick={handleSignUp}
          className={`w-full p-3 rounded text-white ${
            isSigningUp ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
          }`}
          disabled={isSigningUp} // ✅ Disable button while signing up
        >
          {isSigningUp ? "Signing Up..." : "Sign Up"} {/* ✅ Update text while signing up */}
        </button>
      </div>
    </div>
  )
}

export default SignUp
