'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, storage, db } from '@/app/config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  const handleSignUp = async () => {
    try {
      if (!email || !password || !userName) {
        alert("Please enter a username, email, and password.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (!userCredential) {
        console.log("Signup failed: userCredential is undefined");
        return;
      }

      const newUser = userCredential.user;
      let avatarUrl = ""; 

      if (avatar) {
        const avatarRef = ref(storage, `avatars/${newUser.uid}`);
        await uploadBytes(avatarRef, avatar);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      const userData = {
        id: newUser.uid,
        userName: userName,  
        email: newUser.email,
        avatar: avatarUrl,
        createdAt: new Date(),
      };

      await setDoc(doc(collection(db, "users"), newUser.uid), userData);

      // ✅ Save user data to local storage (or sessionStorage)
      localStorage.setItem("currentUser", JSON.stringify(userData));

      console.log("User Signed Up:", newUser);
      router.push("/"); // ✅ Redirect after sign-up

    } catch (e) {
      console.error("Signup Error:", e);
    }
  };

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
        />
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
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 mt-3">{error.message}</p>}
      </div>
    </div>
  );
};

export default SignUp;
