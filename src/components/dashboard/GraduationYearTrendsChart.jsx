'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { SARTHAK_THEME } from '@/lib/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#001439] p-3 border border-[#4a5f7c] rounded-xl shadow-xl">
        <p className="text-sm font-medium text-[#a8bdda] mb-1">{label}</p>
        <p className="text-lg font-extrabold text-white">{payload[0].value} Graduates</p>
      </div>
    );
  }
  return null;
};

export default function GraduationYearTrendsChart({ alumni = [] }) {
  // Calculate graduation year trends from alumni data
  const data = React.useMemo(() => {
    if (alumni.length === 0) {
      // Fallback mock data when no alumni data available
      return [
        { year: '2019', graduates: 120 },
        { year: '2020', graduates: 180 },
        { year: '2021', graduates: 150 },
        { year: '2022', graduates: 250 },
        { year: '2023', graduates: 380 },
        { year: '2024', graduates: 320 },
      ];
    }

    const yearMap = {};
    alumni.forEach((a) => {
      if (a.graduationYear) {
        yearMap[a.graduationYear] = (yearMap[a.graduationYear] || 0) + 1;
      }
    });

    return Object.entries(yearMap)
      .map(([year, graduates]) => ({ year, graduates }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      .slice(-6); // Last 6 years
  }, [alumni]);

  return (
    <div className="h-[26rem] bg-[#f6faff] border border-[#e4f0ff] rounded-[24px] p-6 shadow-sm flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className="text-xl font-extrabold text-[#001439]">Graduation Trends</h3>
        <button className="flex items-center gap-2 bg-[#e4f0ff] hover:bg-[#a8bdda] text-[#001145] text-sm font-bold px-4 py-2 rounded-full transition-colors">
          Last 6 Years
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-0 text-sm z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGraduatesSarthak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#001145" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#001145" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#a8bdda" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4a5f7c', fontWeight: 600, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4a5f7c', fontWeight: 600, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#001145', strokeWidth: 2, opacity: 0.1 }} />
            <Area
              type="monotone"
              dataKey="graduates"
              stroke="#001145"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGraduatesSarthak)"
              activeDot={{ r: 6, stroke: '#f6faff', strokeWidth: 2, fill: '#001145' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
