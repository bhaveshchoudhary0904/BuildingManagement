import React from 'react';

const sampleData = [
  { id: 1, name: 'Ria Gupta', apartment: 'A-302', time: '10:15 AM', status: 'Allowed' },
  { id: 2, name: 'Aakash Mehta', apartment: 'B-101', time: '11:25 AM', status: 'Pending' },
  { id: 3, name: 'Simran Kaur', apartment: 'C-205', time: '09:40 AM', status: 'Denied' },
];

const VisitorTable = ({ visitors = sampleData }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Visitor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Apartment</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Time</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {visitors.map((visitor) => (
            <tr key={visitor.id}>
              <td className="px-6 py-4 text-sm text-slate-700">{visitor.name}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{visitor.apartment}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{visitor.time}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{visitor.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorTable;
