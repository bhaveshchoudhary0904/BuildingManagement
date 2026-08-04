import React from 'react';

const sampleData = [
  { id: 1, resident: 'Meera Sharma', amount: '₹12,000', status: 'Paid' },
  { id: 2, resident: 'Sahil Verma', amount: '₹15,000', status: 'Due' },
  { id: 3, resident: 'Neha Joshi', amount: '₹10,500', status: 'Paid' },
];

const RecentPaymentsTable = ({ payments = sampleData }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Resident</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 text-sm text-slate-700">{payment.resident}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{payment.amount}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentPaymentsTable;
