import React from 'react';

interface CategoryChartProps {
  data: Record<string, number>;
}

const COLORS = [
  '#4F46E5', // indigo-600
  '#7C3AED', // violet-600
  '#EC4899', // pink-600
  '#EF4444', // red-500
  '#F59E0B', // amber-500
  '#10B981', // emerald-500
  '#3B82F6', // blue-500
  '#8B5CF6', // purple-500
  '#F97316', // orange-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#A855F7', // purple-500
];

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  if (total === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No expense data available</p>
      </div>
    );
  }

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {sortedCategories.reduce((acc, { category, amount }, index) => {
              const percentage = (amount / total) * 100;
              const previousPercentage = acc.previousPercentage;
              
              // Calculate the SVG arc parameters
              const startAngle = (previousPercentage / 100) * 360;
              const endAngle = ((previousPercentage + percentage) / 100) * 360;
              
              // Convert angles to radians for calculations
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);
              
              // Calculate the SVG arc path
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Determine if the arc should be drawn as a large arc
              const largeArcFlag = percentage > 50 ? 1 : 0;
              
              // Create the SVG path for the arc
              const path = `
                M 50 50
                L ${x1} ${y1}
                A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              acc.paths.push(
                <path
                  key={category}
                  d={path}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
              
              acc.previousPercentage += percentage;
              return acc;
            }, { paths: [] as React.ReactNode[], previousPercentage: 0 }).paths}
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {sortedCategories.map(({ category, amount, percentage }, index) => (
          <div key={category} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
              <div className="text-sm text-gray-900">₹{amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;