import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { userService, type Statistics } from '../../services/userService';
import { useToastContext } from '../../context/ToastContext';
import StatisticsChart from './StatisticsChart';
import StatsCard from './StatsCard';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToastContext();

  useEffect(() => {
    if (isOpen) {
      loadStatistics();
    }
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#334155] sticky top-0 bg-white dark:bg-[#1e293b] z-10">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Statistics & Insights
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track your productivity over time
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : statistics ? (
                  <div className="space-y-6">
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

                    {/* Chart */}
                    <StatisticsChart statistics={statistics} />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">No statistics available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
