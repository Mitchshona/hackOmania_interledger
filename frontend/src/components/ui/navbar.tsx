import Link from "next/link"
import { Smartphone } from "lucide-react"

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="px-4 lg:px-6 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link className="flex items-center justify-center" href="/">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">Wellquit</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/feed">
            Feed
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar