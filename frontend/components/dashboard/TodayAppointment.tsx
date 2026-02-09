import { format } from 'date-fns';

export default function TodayAppointment({ appointments }: any) {
  const displayAppointments = appointments?.slice(0, 4) || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-bold text-blue-900 mb-4">Today Appointment</h2>
      
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 pb-2 border-b">
          <span>Patient</span>
          <span>Name/Diagnosis</span>
          <span className="text-right">Time</span>
        </div>

        {displayAppointments.map((apt: any, idx: number) => (
          <div key={apt.id} className="grid grid-cols-3 gap-2 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {apt.user?.name?.charAt(0) || 'P'}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900">{apt.user?.name || 'Patient'}</p>
              <p className="text-xs text-gray-600">{apt.service?.name || 'Checkup'}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 bg-blue-200 text-blue-900 text-xs font-medium rounded-lg">
                {format(new Date(apt.startTime), 'hh:mm a')}
              </span>
            </div>
          </div>
        ))}

        {displayAppointments.length === 0 && (
          <p className="text-center text-gray-500 py-4 text-xs">No appointments today</p>
        )}

        {displayAppointments.length > 0 && (
          <button className="text-blue-600 text-xs font-semibold hover:underline">
            See All
          </button>
        )}
      </div>
    </div>
  );
}
