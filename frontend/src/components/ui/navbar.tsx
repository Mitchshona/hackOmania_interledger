"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [user, setUser] = useState<{ userName: string; avatar: string } | null>(null)
  const router = useRouter()

  // ✅ Function to fetch user data from localStorage
  const getUserData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (currentUser && currentUser.userName) {
      setUser({
        userName: currentUser.userName,
        avatar: currentUser.avatar || "/placeholder.svg?height=40&width=40",
      })
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    getUserData() // ✅ Load user data on mount

    // ✅ Listen for storage changes (detect login/logout)
    const handleStorageChange = () => getUserData()
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // ✅ Logout function to remove user from localStorage
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    window.dispatchEvent(new Event("storage")) // ✅ Trigger navbar update
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="px-4 lg:px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
        <Link 
          className="flex items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg" 
          href="/"
          aria-label="Go to homepage"
        >
          <img 
            src="/welllogo.svg" 
            alt="well Logo" 
            className="h-24 w-24"
          />
        </Link>
        <Link href="/feed">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-md px-3 py-5 text-green-600 hover:bg-green-800 rounded-full"
                      >
                        Explore
                      </Button>
                    </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href={`/user/${user.userName}`} className="flex items-center space-x-2">
                <Image
                  src={user.avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-gray-900 font-semibold">{user.userName}</span>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-600 hover:bg-red-100">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link 
                className="text-sm font-medium hover:underline underline-offset-4 py-2" 
                href="/sign-in"
              >
                Sign in
              </Link>
              <Link href="/sign-up">
                <Button className="bg-red-600 hover:bg-red-800 text-white">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
