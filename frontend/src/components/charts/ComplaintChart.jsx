import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const sampleData = [
  { issue: 'Plumbing', count: 12 },
  { issue: 'Electrical', count: 8 },
  { issue: 'Cleaning', count: 15 },
  { issue: 'Security', count: 5 },
  { issue: 'Other', count: 7 },
];

const ComplaintChart = ({ data = sampleData }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Complaint Breakdown</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="issue" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintChart;
