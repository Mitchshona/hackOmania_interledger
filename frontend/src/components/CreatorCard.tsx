import { Calendar, Flame } from 'lucide-react'

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
      className="w-full py-12 md:py-24 lg:py-32 bg-white"
      aria-labelledby="creators-title"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center">
        <h2 
          id="creators-title"
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
        >
          Be a creator
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
          <StatCard
            icon="streak"
            value={7}
            label="Current Streak"
            variant="blue"
          />
        </div>
      </div>
    </section>
  )
}

export default CreatorCard