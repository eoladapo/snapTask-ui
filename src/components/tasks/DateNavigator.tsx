import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  // Get today's date in local timezone
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const isToday = selectedDate.getTime() === todayLocal.getTime();
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(todayLocal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-lg shadow-sm"
    >
      <button
        onClick={handlePrevDay}
        className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--color-purple-primary)] flex-shrink-0" />
          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 text-center">
            {formatDate(selectedDate)}
          </span>
        </div>
        
        {!isToday && (
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--color-purple-primary)] hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors whitespace-nowrap"
          >
            Go to Today
          </button>
        )}
      </div>

      <button
        onClick={handleNextDay}
        className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </motion.div>
  );
};

export default DateNavigator;
