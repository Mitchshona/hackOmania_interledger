import { Calendar, Users } from 'lucide-react'

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
              variant="blue"
            />
          </div>
          <div className="max-w-xl space-y-4 text-gray-300">
            <h3 className="text-2xl font-semibold text-white">Track Your Creative Journey</h3>
            <p>
              Stay motivated and consistent with your creative work by tracking your daily streaks. 
              Whether you're writing, designing, or coding, maintaining a streak helps build lasting habits.
            </p>
            <p>
              Your current streak shows your ongoing commitment, while your longest streak 
              represents your best run of consistent creativity. Keep pushing to beat your record!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupporterCard;