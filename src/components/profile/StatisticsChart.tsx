import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Statistics } from '../../services/userService';

interface StatisticsChartProps {
  statistics: Statistics;
}

type ChartView = 'daily' | 'weekly' | 'monthly';

const StatisticsChart: React.FC<StatisticsChartProps> = ({ statistics }) => {
  const [activeView, setActiveView] = useState<ChartView>('daily');

  const getChartData = () => {
    switch (activeView) {
      case 'daily':
        return statistics.trends.daily;
      case 'weekly':
        return statistics.trends.weekly;
      case 'monthly':
        return statistics.trends.monthly;
      default:
        return statistics.trends.daily;
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map((d) => d.total), 1);

  const getLabel = (item: any) => {
    if (activeView === 'daily') {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    if (activeView === 'weekly') {
      return item.week;
    }
    return item.month;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-[#334155] shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Task Completion Trends
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your productivity over time
          </p>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 bg-gray-100 dark:bg-[#0f172a] p-1 rounded-lg">
          {(['daily', 'weekly', 'monthly'] as ChartView[]).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === view
                  ? 'bg-white dark:bg-[#334155] text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {chartData.map((item, index) => {
            const completionPercentage = item.total > 0 ? (item.completed / item.total) * 100 : 0;
            const heightPercentage = item.total > 0 ? (item.total / maxValue) * 100 : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {getLabel(item)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.completed} / {item.total}
                  </span>
                </div>

                <div className="relative h-12 bg-gray-100 dark:bg-[#0f172a] rounded-lg overflow-hidden">
                  {/* Total bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${heightPercentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="absolute inset-y-0 left-0 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  />

                  {/* Completed bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(heightPercentage * completionPercentage) / 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 + 0.1 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-end pr-3"
                  >
                    {completionPercentage > 15 && (
                      <span className="text-xs font-semibold text-white">
                        {Math.round(completionPercentage)}%
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsChart;
