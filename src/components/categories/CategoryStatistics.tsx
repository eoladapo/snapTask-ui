import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { CategoryStatistic } from '../../services/userService';

interface CategoryStatisticsProps {
  categoryBreakdown: CategoryStatistic[];
}

const CategoryStatistics: React.FC<CategoryStatisticsProps> = ({ categoryBreakdown }) => {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No category data available. Create categories and assign tasks to see insights.
        </p>
      </div>
    );
  }

  // Sort by total tasks descending
  const sortedCategories = [...categoryBreakdown].sort((a, b) => b.totalTasks - a.totalTasks);

  // Calculate total tasks for percentage
  const totalTasks = categoryBreakdown.reduce((sum, cat) => sum + cat.totalTasks, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Category Breakdown
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Task distribution across categories
          </p>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {sortedCategories.map((category, index) => {
          const percentage = totalTasks > 0 ? Math.round((category.totalTasks / totalTasks) * 100) : 0;

          return (
            <motion.div
              key={category.categoryId || 'uncategorized'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#1e293b] rounded-lg p-4 border border-gray-200 dark:border-[#334155]"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.categoryColor }}
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {category.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {category.totalTasks} {category.totalTasks === 1 ? 'task' : 'tasks'}
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-100 dark:bg-[#0f172a] rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.completionRate}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Completed</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {category.completedTasks}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">In Progress</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {category.inProgressTasks}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Pending</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {category.pendingTasks}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completion Rate Badge */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#334155]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      category.completionRate >= 75
                        ? 'text-green-600 dark:text-green-400'
                        : category.completionRate >= 50
                        ? 'text-blue-600 dark:text-blue-400'
                        : category.completionRate >= 25
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {category.completionRate}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights */}
      {sortedCategories.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
            📊 Insights
          </h4>
          <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
            {(() => {
              const topCategory = sortedCategories[0];
              const highestCompletion = [...sortedCategories].sort(
                (a, b) => b.completionRate - a.completionRate
              )[0];
              const lowestCompletion = [...sortedCategories]
                .filter((c) => c.totalTasks > 0)
                .sort((a, b) => a.completionRate - b.completionRate)[0];

              return (
                <>
                  <li>
                    • <strong>{topCategory.categoryName}</strong> has the most tasks (
                    {topCategory.totalTasks})
                  </li>
                  {highestCompletion && highestCompletion.totalTasks > 0 && (
                    <li>
                      • <strong>{highestCompletion.categoryName}</strong> has the highest
                      completion rate ({highestCompletion.completionRate}%)
                    </li>
                  )}
                  {lowestCompletion &&
                    lowestCompletion.completionRate < 50 &&
                    lowestCompletion.totalTasks > 0 && (
                      <li>
                        • <strong>{lowestCompletion.categoryName}</strong> needs attention (
                        {lowestCompletion.completionRate}% complete)
                      </li>
                    )}
                </>
              );
            })()}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryStatistics;
