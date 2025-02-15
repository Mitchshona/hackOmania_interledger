'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/config/firebase-config';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (!res || !res.user) {
        alert("Sign-in failed. Please try again.");
        return;
      }

      const userId = res.user.uid; // ✅ Get user ID from Firebase Auth

      // ✅ Fetch user data from Firestore
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert("User data not found. Please contact support.");
        return;
      }

      const userData = userDocSnap.data();

      // ✅ Store user details in localStorage
      localStorage.setItem("currentUser", JSON.stringify({
        id: userId,
        userName: userData.userName,
        email: res.user.email,
        avatar: userData.avatar,
      }));

      console.log("User Signed In:", userData);
      sessionStorage.setItem('user', "true");

      // ✅ Redirect to home page
      router.push('/');

    } catch (e) {
      console.error("Sign-in Error:", e);
      alert("Failed to sign in. Please check your credentials.");
    }
  };

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
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
