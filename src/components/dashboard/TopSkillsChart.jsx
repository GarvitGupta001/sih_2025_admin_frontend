'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Only these 5 blue shades
const BAR_COLORS = ['#001145', '#001439', '#4a5f7c', '#7088aa', '#a8bdda'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#001439] p-3 border border-[#4a5f7c] rounded-lg shadow-md">
        <p className="text-sm font-bold text-[#f6f9fe] mb-1">{payload[0].name}</p>
        <p className="text-sm text-white">{payload[0].value} Alumni</p>
      </div>
    );
  }
  return null;
};

export default function TopSkillsChart({ alumni = [] }) {
  // Calculate top skills from alumni data
  const data = React.useMemo(() => {
    if (alumni.length === 0) {
      // Fallback mock data when no alumni data available
      return [
        { name: 'Programming', value: 85 },
        { name: 'Management', value: 65 },
        { name: 'Data Analysis', value: 45 },
        { name: 'Design', value: 30 },
        { name: 'Leadership', value: 25 },
      ];
    }

    const skillMap = {};
    alumni.forEach((a) => {
      const skills = a.skills || [];
      skills.forEach((skill) => {
        skillMap[skill] = (skillMap[skill] || 0) + 1;
      });
    });

    return Object.entries(skillMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 skills
  }, [alumni]);

  return (
    // Clean solid background, standard border
    <div className="h-[26rem] bg-white border border-[#dbeaff] rounded-2xl p-6 flex flex-col">
      <h3 className="text-xl font-bold text-[#001439] mb-6">Top Skills</h3>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 10, left: 40, bottom: 0 }}
            barSize={32}
          >
            {/* Simple dashed grid */}
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4f0ff" />

            <XAxis type="number" hide />

            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: '#4a5f7c', fontSize: 13, fontWeight: 600 }}
              width={110}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f6f9fe' }} />

            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
