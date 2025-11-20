import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { userService, type Statistics } from '../../services/userService';
import { useToastContext } from '../../context/ToastContext';
import StatsCard from './StatsCard';

type PeriodView = 'weekly' | 'monthly' | 'yearly';

const StatisticsView: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<PeriodView>('weekly');
  const { showError } = useToastContext();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await userService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      showError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!statistics) return [];
    switch (activePeriod) {
      case 'weekly':
        return statistics.trends.daily;
      case 'monthly':
        return statistics.trends.weekly;
      case 'yearly':
        return statistics.trends.monthly;
      default:
        return statistics.trends.daily;
    }
  };

  const getLabel = (item: any) => {
    if (activePeriod === 'weekly') {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    if (activePeriod === 'monthly') {
      return item.week;
    }
    return item.month;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No statistics available</p>
      </div>
    );
  }

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Statistics & Insights
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Track your productivity over time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Target className="w-6 h-6" />}
          title="Total Tasks"
          value={statistics.overview.totalTasks}
          color="purple"
        />
        <StatsCard
          icon={<Award className="w-6 h-6" />}
          title="Completed"
          value={statistics.overview.completedTasks}
          color="green"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Completion Rate"
          value={`${statistics.overview.completionRate}%`}
          color="blue"
        />
        <StatsCard
          icon={<Calendar className="w-6 h-6" />}
          title="This Month"
          value={statistics.periods.month.completed}
          subtitle={`of ${statistics.periods.month.total} tasks`}
          color="orange"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-[#334155]">
        {/* Period Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Completion Trend
          </h2>

          <div className="flex gap-2 bg-gray-100 dark:bg-[#0f172a] p-1 rounded-lg">
            {(['weekly', 'monthly', 'yearly'] as PeriodView[]).map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activePeriod === period
                    ? 'bg-white dark:bg-[#334155] text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePeriod}
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
      </div>
    </motion.div>
  );
};

export default StatisticsView;
