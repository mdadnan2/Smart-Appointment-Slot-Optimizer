import { Users, Calendar, CheckCircle } from 'lucide-react';

interface PatientStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: 'appointments' | 'upcoming' | 'completed';
}

export default function PatientStatsCard({ title, value, subtitle, icon }: PatientStatsCardProps) {
  const icons = {
    appointments: <Calendar size={20} />,
    upcoming: <CheckCircle size={20} />,
    completed: <Users size={20} />
  };

  const colors = {
    appointments: 'from-blue-50 to-indigo-50 border-blue-600 text-blue-600',
    upcoming: 'from-green-50 to-emerald-50 border-green-600 text-green-600',
    completed: 'from-purple-50 to-violet-50 border-purple-600 text-purple-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[icon]} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-white border-3 border-${icon === 'appointments' ? 'blue' : icon === 'upcoming' ? 'green' : 'purple'}-600 flex items-center justify-center ${colors[icon].split(' ')[2]}`}>
          {icons[icon]}
        </div>
        <div>
          <p className="text-gray-600 text-xs font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 my-0.5">{value}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
