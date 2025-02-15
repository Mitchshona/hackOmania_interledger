import { Calendar, Flame } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type StatCardProps = {
  icon: 'streak' | 'longest'
  value: number
  label: string
  variant: 'blue' | 'green'
}

const StatCard = ({ icon, value, label, variant }: StatCardProps) => {
  const variants = {
    blue: {
      wrapper: 'bg-blue-50',
      icon: 'bg-blue-500',
      text: 'text-blue-600'
    },
    green: {
      wrapper: 'bg-green-50',
      icon: 'bg-green-500',
      text: 'text-green-600'
    }
  }

  return (
    <div className={`${variants[variant].wrapper} p-8 rounded-xl flex flex-col items-center space-y-4 w-full md:w-80`}>
      <div className={`${variants[variant].icon} p-4 rounded-full`}>
        {icon === 'streak' ? (
          <Flame className="h-8 w-8 text-white" />
        ) : (
          <Calendar className="h-8 w-8 text-white" />
        )}
      </div>
      <div className="text-center">
        <h3 className={`text-4xl font-bold ${variants[variant].text} mb-2`}>{value} Days</h3>
        <p className="text-gray-600">{label}</p>
        
      </div>


    </div>
  )
}

const CreatorCard = () => {
  return (
    <section 
      id="creators" 
      className="snap-start w-full h-screen sticky top-0 bg-blue-950 flex items-center justify-center"
      aria-labelledby="creators-title"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6 z-10">
        <h2 
          id="creators-title"
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-white"
        >
          Be a Creator
        </h2>
        <div className="w-[80%] mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <StatCard
              icon="streak"
              value={73}
              label="Current Streak"
              variant="blue"
            />
          </div>
          <div className="max-w-xl space-y-4 text-gray-300">
            <h3 className="text-2xl font-semibold text-white">Be supported in your recovery journey.</h3>
            <p>
              Create better digital use habits by sharing your daily experiences with addiction recovery            </p>
            <p>
              Be rewarded for keeping a streak of low screen time usage.
            </p>
            <Link href="/sign-up" className="mt-8 block">
              <Button size="lg" className="bg-red-600 hover:bg-red-800 text-white text-lg px-8 py-6">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreatorCard