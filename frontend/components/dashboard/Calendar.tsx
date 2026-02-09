import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from 'date-fns';

export default function Calendar() {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const weekDays = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm overflow-hidden max-w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm sm:text-base font-bold text-gray-800">Calander</h2>
        <span className="text-xs sm:text-sm text-blue-600 font-semibold">
          {format(currentDate, 'MMMM - yyyy')}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1 sm:mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs">
        {Array.from({ length: startDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square"></div>
        ))}
        
        {daysInMonth.map((day) => {
          const isToday = format(day, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
          const dayNum = format(day, 'd');
          
          return (
            <div
              key={day.toString()}
              className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer
                ${isToday ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}
                ${!isSameMonth(day, currentDate) ? 'text-gray-300' : ''}
              `}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
