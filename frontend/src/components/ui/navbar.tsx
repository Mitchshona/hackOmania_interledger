import Link from "next/link"
import { Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="px-4 lg:px-6 h-20 flex items-center justify-between w-[90%] mx-auto">
        <Link className="flex items-center justify-center" href="/">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">Wellquit</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link 
            className="text-sm font-medium hover:underline underline-offset-4 py-2" 
            href="#features"
          >
            Features
          </Link>
          <Link 
            className="text-sm font-medium hover:underline underline-offset-4 py-2" 
            href="#testimonials"
          >
            Testimonials
          </Link>
          <Link 
            className="text-sm font-medium hover:underline underline-offset-4 py-2" 
            href="/feed"
          >
            Feed
          </Link>
          <Link href="/feed">
            <Button className="bg-red-600 hover:bg-red-800 text-white">
              Start your journey
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar