import React from 'react';

const sampleData = [
  { id: 1, resident: 'Amit Kumar', issue: 'Plumbing', status: 'Open' },
  { id: 2, resident: 'Priya Singh', issue: 'Electrical', status: 'In Progress' },
  { id: 3, resident: 'Rohan Patel', issue: 'Security', status: 'Resolved' },
];

const RecentComplaintsTable = ({ complaints = sampleData }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Resident</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Issue</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="px-6 py-4 text-sm text-slate-700">{complaint.resident}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{complaint.issue}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{complaint.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentComplaintsTable;
