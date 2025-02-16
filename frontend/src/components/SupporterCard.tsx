import { Calendar, Users } from 'lucide-react'
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
          <Users className="h-8 w-8 text-white" />
        ) : (
          <Calendar className="h-8 w-8 text-white" />
        )}
      </div>
      <div className="text-center">
        <h3 className={`text-4xl font-bold ${variants[variant].text} mb-2`}>{value} People</h3>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  )
}

const SupporterCard = () => {
  return (
    <section 
      id="supporters" 
      className="snap-start w-full h-screen sticky top-0 bg-green-950 flex items-center justify-center"
      aria-labelledby="supporters-title"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6 z-10">
        <h2 
          id="supporters-title"
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-white"
        >
          Be a supporter
        </h2>
        <div className="w-[80%] mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <StatCard
              icon="streak"
              value={13}
              label="Encouraged"
              variant="green"
            />
          </div>
          <div className="max-w-xl space-y-4 text-gray-300">
            <h3 className="text-2xl font-semibold text-white">Encourage those in your community with direct donations.</h3>
            <p>
              Watch our commmunity creators share their stories,
              and cheer them on through a direct and transparent donation.
            </p>

                    <Link href="/feed" className='mt-8 block'>
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
    </section>
  )
}

export default SupporterCard;