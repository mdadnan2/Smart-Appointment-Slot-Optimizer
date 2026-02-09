import { Phone, FileText, MessageCircle } from 'lucide-react';

export default function NextPatientDetails() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-blue-900 mb-6">Next Patient Details</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
        <div>
          <h3 className="font-bold text-gray-900">Sanath Deo</h3>
          <p className="text-sm text-gray-600">Health Cheakup</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-600">Patient ID</p>
          <p className="text-sm font-semibold">0220092020005</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-600">D. O.B</p>
          <p className="text-sm font-semibold">15 January 1989</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Sex</p>
          <p className="text-sm font-semibold">Male</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Weight</p>
          <p className="text-sm font-semibold">59 Kg</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Last Appoinment</p>
          <p className="text-sm font-semibold">15 Dec - 2021</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Hight</p>
          <p className="text-sm font-semibold">172 cm</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Reg. Date</p>
          <p className="text-sm font-semibold">10 Dec 2021</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-800 mb-2">Patient History</p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Asthma</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Hypertension</span>
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">Fever</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Phone size={16} />
          (308) 555-0103
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <FileText size={16} className="text-gray-600" />
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <MessageCircle size={16} className="text-gray-600" />
        </button>
      </div>

      <p className="text-sm font-semibold text-gray-800">Last Prescriptions</p>
    </div>
  );
}
