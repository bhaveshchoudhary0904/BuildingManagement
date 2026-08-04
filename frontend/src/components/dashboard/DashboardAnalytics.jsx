import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const DashboardAnalytics = ({
  revenueData = [],
  complaintData = [],
  occupancyData = [],
}) => {

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
  ];

  return (

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Revenue */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={revenueData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* Complaints */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">
          Complaint Trend
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <BarChart data={complaintData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#dc2626"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Occupancy */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">
          Occupancy
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={occupancyData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >

              {occupancyData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Quick Stats */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-6">
          Society Summary
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between">

            <span>Total Flats</span>

            <strong>120</strong>

          </div>

          <div className="flex justify-between">

            <span>Occupied</span>

            <strong>95</strong>

          </div>

          <div className="flex justify-between">

            <span>Vacant</span>

            <strong>25</strong>

          </div>

          <div className="flex justify-between">

            <span>Maintenance Due</span>

            <strong>₹2,45,000</strong>

          </div>

          <div className="flex justify-between">

            <span>Today's Visitors</span>

            <strong>14</strong>

          </div>

        </div>

      </div>

    </div>

  );

};

export default DashboardAnalytics;