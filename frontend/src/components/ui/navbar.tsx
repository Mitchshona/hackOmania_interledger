import Link from "next/link"
import { Button } from "@/components/ui/button"
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="px-4 lg:px-6 h-20 flex items-center justify-between w-[90%] mx-auto">
        <Link className="flex items-center justify-center" href="/">
          <img 
            src="/welllogo.svg" 
            alt="well Logo" 
            className="h-32 w-32"
          />
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
            href="/sign-in"
          >
            Sign in
          </Link>
          <Link href="/sign-up">
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