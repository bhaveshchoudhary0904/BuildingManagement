const prisma = require("../config/prisma");

/*
=====================================
Dashboard Statistics
GET /api/dashboard
=====================================
*/

exports.getDashboard = async (req, res) => {
  try {
    // Filter by building if user is not a developer
    let whereClause = {};
    
    if (req.user?.role === "DEVELOPER") {
      whereClause = {};
    } else if (req.user?.building_id) {
      whereClause = { building_id: req.user.building_id };
    } else {
      // If user has no building_id, return empty statistics
      return res.json({
        success: true,
        data: {
          residents: 0,
          occupiedFlats: 0,
          totalFlats: 0,
          revenue: 0,
          pendingComplaints: 0,
          visitorsToday: 0,
          notices: 0,
        },
      });
    }

    const residents = await prisma.residents.count({
      where: whereClause,
    });

    const occupiedFlats = await prisma.units.count({
      where: {
        ...whereClause,
        occupancy_status: "Occupied",
      },
    });

    const totalFlats = await prisma.units.count({
      where: whereClause,
    });

    const revenueResult = await prisma.payments.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ...whereClause,
        payment_status: "Paid",
      },
    });

    const pendingComplaints = await prisma.complaints.count({
      where: {
        ...whereClause,
        status: "Pending",
      },
    });

    const visitorsToday = await prisma.visitors.count({
      where: {
        ...whereClause,
        check_in: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const notices = await prisma.notices.count({
      where: whereClause,
    });

    res.json({
      success: true,
      data: {
        residents,
        occupiedFlats,
        totalFlats,
        revenue: Number(revenueResult._sum.amount || 0),
        pendingComplaints,
        visitorsToday,
        notices,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=====================================
Dashboard Analytics
GET /api/dashboard/analytics
=====================================
*/

exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Filter by building if user is not a developer
    let whereClause = {};
    
    if (req.user?.role === "DEVELOPER") {
      whereClause = {};
    } else if (req.user?.building_id) {
      whereClause = { building_id: req.user.building_id };
    } else {
      // If user has no building_id, return empty analytics
      return res.status(200).json({
        success: true,
        data: {
          occupancy: {
            occupied: 0,
            vacant: 0,
          },
          complaints: [],
          monthlyRevenue: [],
        },
      });
    }

    const occupied = await prisma.units.count({
      where: {
        ...whereClause,
        occupancy_status: "Occupied",
      },
    });

    const vacant = await prisma.units.count({
      where: {
        ...whereClause,
        occupancy_status: "Vacant",
      },
    });

    const complaints = await prisma.complaints.groupBy({
      by: ["status"],
      _count: {
        complaint_id: true,
      },
      where: whereClause,
    });

   const monthlyRevenue = await prisma.payments.groupBy({
  by: ["year", "month"],
  _sum: {
    amount: true,
  },
  where: whereClause,
  orderBy: [
    {
      year: "asc",
    },
    {
      month: "asc",
    },
  ],
});
    res.status(200).json({
      success: true,
      data: {
        occupancy: {
          occupied,
          vacant,
        },
        complaints,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};