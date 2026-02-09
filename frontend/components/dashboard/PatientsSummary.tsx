'use client';

export default function PatientsSummary({ stats }: any) {
  const total = stats?.totalPatients || 0;
  const newPatients = stats?.newPatients || 0;
  const oldPatients = stats?.oldPatients || 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-bold text-gray-800 mb-4">Patients Summary</h2>
      
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1E40AF" strokeWidth="20" 
              strokeDasharray="113 251" strokeDashoffset="0" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" 
              strokeDasharray="88 251" strokeDashoffset="-113" />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-900"></div>
          <span className="text-xs text-gray-600 flex-1">New Patients</span>
          <span className="text-xs font-semibold">{newPatients}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-600 flex-1">Old Patients</span>
          <span className="text-xs font-semibold">{oldPatients}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-xs text-gray-600 flex-1">Total Patients</span>
          <span className="text-xs font-semibold">{total}</span>
        </div>
      </div>
    </div>
  );
}
