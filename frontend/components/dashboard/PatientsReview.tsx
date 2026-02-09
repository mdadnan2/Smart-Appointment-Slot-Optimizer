export default function PatientsReview() {
  const reviews = [
    { label: 'Excellent', percentage: 80, color: 'bg-blue-600' },
    { label: 'Great', percentage: 60, color: 'bg-green-600' },
    { label: 'Good', percentage: 40, color: 'bg-orange-500' },
    { label: 'Average', percentage: 20, color: 'bg-cyan-400' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-gray-800 mb-6">Patients Review</h2>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">{review.label}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${review.color} h-2 rounded-full transition-all`}
                style={{ width: `${review.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
