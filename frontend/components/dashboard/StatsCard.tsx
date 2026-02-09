import { Users, UserCheck, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: 'users' | 'user-check' | 'clock';
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  const icons = {
    users: <Users size={20} />,
    'user-check': <UserCheck size={20} />,
    clock: <Clock size={20} />
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white border-3 border-blue-600 flex items-center justify-center text-blue-600">
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
