'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SARTHAK_CHART_COLORS, SARTHAK_THEME } from '@/lib/theme';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#001145] p-3 border border-[#4a5f7c] rounded-xl shadow-xl">
        <p className="text-sm font-bold text-[#e4f0ff] mb-1">{payload[0].name}</p>
        <p className="text-lg font-extrabold text-white">{payload[0].value} Alumni</p>
      </div>
    );
  }
  return null;
};

const renderLegendText = (value) => {
  return <span className="text-sm text-[#4a5f7c] font-semibold ml-2">{value}</span>;
};

export default function DepartmentDistributionChart({ alumni = [] }) {
  // Calculate department distribution from alumni data
  const data = React.useMemo(() => {
    if (alumni.length === 0) {
      // Fallback mock data when no alumni data available
      return [
        { name: 'Computer Science', value: 450 },
        { name: 'Electronics & Comm.', value: 300 },
        { name: 'Mechanical Eng.', value: 200 },
        { name: 'Civil Eng.', value: 150 },
        { name: 'Information Tech.', value: 100 },
      ];
    }

    const deptMap = {};
    alumni.forEach((a) => {
      const dept = a.department || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return Object.entries(deptMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 departments
  }, [alumni]);

  return (
    <div className="h-[26rem] rounded-[24px] p-6 shadow-sm flex flex-col relative overflow-hidden bg-[#f6faff] border border-[#e4f0ff]">
      <h3 className="text-xl font-extrabold text-[#001439] mb-4 z-10">Department Distribution</h3>
      <div className="flex-1 w-full min-h-0 z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              stroke="#f6faff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SARTHAK_CHART_COLORS[index % SARTHAK_CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={renderLegendText}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ right: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
