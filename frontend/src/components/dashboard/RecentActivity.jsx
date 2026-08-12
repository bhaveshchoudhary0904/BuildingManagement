import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  RefreshCw,
  AlertCircle,
  CreditCard,
  UserPlus,
  UserCheck,
  Bell,
} from "lucide-react";

const RecentActivity = () => {
  const [data, setData] = useState({
    complaints: [],
    payments: [],
    residents: [],
    visitors: [],
    notices: [],
  });

  const [loading, setLoading] = useState(true);

  const loadActivity = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/dashboard/recent-activity");

      setData(data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();

    const interval = setInterval(loadActivity, 60000);

    return () => clearInterval(interval);

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <RefreshCw className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Complaints */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
          <AlertCircle className="text-red-500" />
          Recent Complaints
        </h2>

        <div className="space-y-3">

          {data.complaints.map((item) => (

            <div
              key={item.id}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <h4 className="font-medium">
                  {item.title}
                </h4>

                <p className="text-sm text-gray-500">
                  {item.flatNumber}
                </p>
              </div>

              <span className="text-red-600 font-semibold">
                {item.status}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Payments */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
          <CreditCard className="text-green-600" />
          Latest Payments
        </h2>

        <div className="space-y-3">

          {data.payments.map((payment) => (

            <div
              key={payment.id}
              className="flex justify-between border-b pb-2"
            >
              <div>

                <h4>{payment.flatNumber}</h4>

                <p className="text-sm text-gray-500">

                  {payment.month}

                </p>

              </div>

              <strong>

                ₹{payment.amount.toLocaleString()}

              </strong>

            </div>

          ))}

        </div>

      </div>

      {/* Residents */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-5 flex items-center gap-2">

          <UserPlus className="text-blue-600"/>

          New Residents

        </h2>

        <div className="space-y-3">

          {data.residents.map((resident)=>(

            <div
              key={resident.id}
              className="flex justify-between border-b pb-2"
            >

              <div>

                <h4>{resident.name}</h4>

                <p className="text-sm text-gray-500">

                  {resident.flatNumber}

                </p>

              </div>

              <span>

                {resident.createdAt}

              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Visitors */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-5 flex items-center gap-2">

          <UserCheck className="text-purple-600"/>

          Today's Visitors

        </h2>

        <div className="space-y-3">

          {data.visitors.map((visitor)=>(

            <div
              key={visitor.id}
              className="flex justify-between border-b pb-2"
            >

              <div>

                <h4>{visitor.visitorName}</h4>

                <p className="text-sm text-gray-500">

                  {visitor.flatNumber}

                </p>

              </div>

              <span>

                {visitor.status}

              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Notices */}

      <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-5 flex items-center gap-2">

          <Bell className="text-yellow-500"/>

          Latest Notices

        </h2>

        <div className="space-y-4">

          {data.notices.map((notice)=>(

            <div
              key={notice.id}
              className="border-l-4 border-blue-600 pl-4"
            >

              <h4 className="font-semibold">

                {notice.title}

              </h4>

              <p className="text-gray-600">

                {notice.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default RecentActivity;