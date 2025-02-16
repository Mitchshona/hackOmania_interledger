import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreatorCard from "@/components/CreatorCard"
import { Smartphone, Users, BarChart, Shield, Calendar, Flame } from "lucide-react"
import Navbar from "@/components/ui/navbar"
import SupporterCard from "@/components/SupporterCard"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-page-scroll">
        <main className="flex-1">
          <section className="snap-start w-full h-screen sticky top-0 bg-blue-100 flex items-center justify-center">
            <div className="w-4/5 max-w-7xl mx-auto px-4 z-10">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 justify-center">
                <img
                  src="/hero-image.jpg"
                  alt="Breaking free from internet addiction"
                  className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="flex flex-col items-start space-y-4 text-left">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                      Break Free from Internet Addiction
                    </h1>
                    <p className="max-w-[700px] text-gray-500 md:text-2xl lg:text-3xl">
                      Share your internet addiction recovery journey on Well and receive support from the community.
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Link href="/sign-up">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-800 text-white text-lg px-8 py-6">
                        Sign up
                      </Button>
                    </Link>
                    <Link href="/feed">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="text-lg px-8 py-6 text-green-600 hover:bg-green-800 "
                      >
                        Explore
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="snap-start w-full h-screen sticky top-0 bg-white flex items-center justify-center">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center z-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                What is Well?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                  icon={<BarChart className="h-10 w-10 text-green-600" />}
                  title="Share your Digital Detox Journey"
                  description="Log your screen time and make community posts"
                />
                
                <FeatureCard
                  icon={<Users className="h-10 w-10 text-blue-600" />}
                  title="Receive support from the community"
                  description="Show your good progress to the community and receive direct donations to support your journey."
                />

                <FeatureCard
                  icon={<Shield className="h-10 w-10 text-purple-600" />}
                  title="Secure Donations"
                  description="We leverage Interledger Protocol to ensure a secure and transparent donation process."
                />
                <FeatureCard
                  icon={<Smartphone className="h-10 w-10 text-red-600" />}
                  title="Earn with Challenges"
                  description="Complete exciting challenges from our partners to earn rewards"
                />
              </div>
            </div>
          </section>

          <CreatorCard />

          <SupporterCard />


          <section id="testimonials" className="snap-start w-full h-screen sticky top-0 bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard
                  image="/regina.jpg"
                  quote="well helped me regain control of my life. I've rediscovered my passion for outdoor activities!"
                  author="Regina, 16"
                />
                <TestimonialCard
                  image="/sam.jpg"
                  quote="The community here is so supportive. I don't feel alone in my struggle anymore."
                  author="Sam, 19"
                />
                <TestimonialCard
                  image="/jordan.jpg"
                  quote="I've improved my focus and relationships since joining well. It's been life-changing!"
                  author="Jordan, 16"
                />
              </div>
            </div>
          </section>

          <section id="cta" className="snap-start w-full h-screen sticky top-0 bg-blue-200 text-black flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Start Your Journey Today
                    </h2>
                    <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                      Join thousands of teens taking control of their digital lives. Sign up for well and begin your
                      path to a balanced lifestyle.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">

                    <Link href="/sign-up" className='mt-4 block'>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-800 text-white text-lg px-8 py-6">
                        Sign up
                      </Button>
                    </Link>

                    <p className="text-xs text-black">
                      By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <footer className="w-full border-t border-blue-500">
              <div className="flex flex-col gap-2 sm:flex-row py-6 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
                <p className="text-xs text-black">© 2024 well. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                  {/* <Link className="text-xs hover:underline underline-offset-4 text-black" href="#">
                    Terms of Service
                  </Link>
                  <Link className="text-xs hover:underline underline-offset-4 text-blue-200" href="#">
                    Privacy
                  </Link> */}
                </nav>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

interface TestimonialCardProps {
  image: string;
  quote: string;
  author: string;
}

function TestimonialCard({ image, quote, author }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <img
          src={image}
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

