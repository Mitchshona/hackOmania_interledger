import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Users, BarChart, Shield, Calendar, Flame } from "lucide-react"
import Navbar from "@/components/ui/navbar"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-100 flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="w-full">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <img
                  src="/hero-image.jpg"
                  alt="Breaking free from internet addiction"
                  className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      Break Free from Internet Addiction
                    </h1>
                    <p className="max-w-[700px] text-gray-500 md:text-xl">
                      Share your internet addiction recovery journey on well and receive support from the community.
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Link href="/feed">
                      <Button className="bg-red-600 hover:bg-red-800 text-white">Start your journey</Button>
                    </Link>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              What is well?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-blue-600" />}
                title="Supportive Community"
                description="Connect with peers who understand your struggles and celebrate your victories."
              />
              <FeatureCard
                icon={<BarChart className="h-10 w-10 text-green-600" />}
                title="Track Your Progress"
                description="Visualize your journey with intuitive charts and milestone tracking."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-purple-600" />}
                title="Safe Space"
                description="A moderated platform ensuring a positive and encouraging environment."
              />
              <FeatureCard
                icon={<Smartphone className="h-10 w-10 text-red-600" />}
                title="Digital Detox Tips"
                description="Access expert advice and practical strategies for managing screen time."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Track Your Progress
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
              <div className="bg-blue-50 p-8 rounded-xl flex flex-col items-center space-y-4 w-full md:w-80">
                <div className="bg-blue-500 p-4 rounded-full">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-blue-600 mb-2">7 Days</h3>
                  <p className="text-gray-600">Current Streak</p>
                </div>
              </div>
              <div className="bg-green-50 p-8 rounded-xl flex flex-col items-center space-y-4 w-full md:w-80">
                <div className="bg-green-500 p-4 rounded-full">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-green-600 mb-2">30 Days</h3>
                  <p className="text-gray-600">Longest Streak</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="well helped me regain control of my life. I've rediscovered my passion for outdoor activities!"
                author="Alex, 17"
              />
              <TestimonialCard
                quote="The community here is so supportive. I don't feel alone in my struggle anymore."
                author="Sam, 15"
              />
              <TestimonialCard
                quote="I've improved my grades and relationships since joining well. It's been life-changing!"
                author="Jordan, 16"
              />
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Your Journey Today
                </h2>
                <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
                  Join thousands of teens taking control of their digital lives. Sign up for well and begin your
                  path to a balanced lifestyle.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input 
                    className="flex-1 placeholder:text-gray-300" 
                    placeholder="your@email.com" 
                    type="email" 
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-blue-200">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-6 border-t max-w-7xl mx-auto">
        <p className="text-xs text-gray-500">© 2024 well. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <img
          src="/success.png"
          alt="Testimonial hero image" 
          width={200}
          height={200}
          className="rounded-full mb-4 object-cover w-[200px] h-[200px]"
        />
        <p className="text-gray-600 mb-4">"{quote}"</p>
        <p className="text-gray-800 font-semibold">- {author}</p>
      </div>
    </div>
  )
}

