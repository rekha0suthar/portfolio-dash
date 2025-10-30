'use client';
import { memo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ComputedRow } from '@/lib/types';

interface PortfolioChartProps {
  data: ComputedRow[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          Value: ₹{data.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ data, isMobile }: { data: Array<{ name: string; color: string }>; isMobile: boolean }) => {
  if (isMobile) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700 truncate text-[14px]">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PortfolioChart = memo(function PortfolioChart({ data }: PortfolioChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartData = data.map((row, index) => ({
    name: row.name,
    value: row.presentValue,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
      <div className="h-96 sm:h-[28rem] lg:h-[32rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isMobile ? 100 : 140}
              innerRadius={isMobile ? 30 : 60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={1}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {!isMobile && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: '8px',
                  fontSize: '12px',
                  lineHeight: '16px'
                }}
                iconType="circle"
                layout="horizontal"
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend data={chartData} isMobile={isMobile} />
    </div>
  );
});

export default PortfolioChart;
