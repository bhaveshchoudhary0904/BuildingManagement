import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const sampleData = [
  { month: 'Jan', occupancy: 85 },
  { month: 'Feb', occupancy: 88 },
  { month: 'Mar', occupancy: 90 },
  { month: 'Apr', occupancy: 92 },
  { month: 'May', occupancy: 94 },
  { month: 'Jun', occupancy: 95 },
];

const OccupancyChart = ({ data = sampleData }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Occupancy Trend</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Area type="monotone" dataKey="occupancy" stroke="#22c55e" fill="#dcfce7" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OccupancyChart;
