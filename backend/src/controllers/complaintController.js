const prisma = require("../config/prisma");

const getComplaints = async (req, res) => {
  try {
    // Filter by building if user is not a developer
    let whereClause = {};
    
    if (req.user?.role === "DEVELOPER") {
      whereClause = {};
    } else if (req.user?.building_id) {
      whereClause = { building_id: req.user.building_id };
    } else {
      // If user has no building_id, return empty array
      return res.status(200).json({ success: true, data: [] });
    }

    const complaints = await prisma.complaints.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
    });

    const residentIds = [...new Set(complaints.map((c) => c.resident_id))];
    const residents = residentIds.length
      ? await prisma.residents.findMany({
          where: { resident_id: { in: residentIds } },
        })
      : [];

    const userIds = residents.map((r) => r.user_id);
    const unitIds = residents.map((r) => r.unit_id);

    const users = userIds.length
      ? await prisma.users.findMany({
          where: { user_id: { in: userIds } },
          select: { user_id: true, name: true, email: true, phone_number: true },
        })
      : [];

    const units = unitIds.length
      ? await prisma.units.findMany({
          where: { unit_id: { in: unitIds } },
          select: { unit_id: true, unit_number: true },
        })
      : [];

    const userMap = Object.fromEntries(users.map((u) => [u.user_id, u]));
    const unitMap = Object.fromEntries(units.map((u) => [u.unit_id, u]));
    const residentMap = Object.fromEntries(
      residents.map((r) => [r.resident_id, r])
    );

    const data = complaints.map((c) => {
      const resident = residentMap[c.resident_id];
      const user = resident ? userMap[resident.user_id] : null;
      const unit = resident ? unitMap[resident.unit_id] : null;

      return {
        complaintId: c.complaint_id,
        title: c.title,
        description: c.description,
        category: c.category,
        priority: c.priority || "Medium",
        status: c.status || "Pending",
        assignedTo: c.assigned_to,
        createdAt: c.created_at,
        residentName: user?.name || null,
        residentEmail: user?.email || null,
        flatNumber: unit?.unit_number || null,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Complaints Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComplaintsByResidentId = async (req, res) => {
  try {
    const { residentId } = req.params;
    const complaints = await prisma.complaints.findMany({
      where: { resident_id: parseInt(residentId) },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, resident_id } = req.body;

    // Get resident_id from authenticated user if not provided
    let targetResidentId = resident_id;
    
    if (!targetResidentId && req.user?.resident_id) {
      targetResidentId = req.user.resident_id;
    }
    
    if (!targetResidentId && req.user?.user_id) {
      const resident = await prisma.residents.findUnique({
        where: { user_id: req.user.user_id },
        select: { resident_id: true, building_id: true },
      });
      if (resident) {
        targetResidentId = resident.resident_id;
      }
    }

    if (!targetResidentId) {
      return res.status(400).json({
        success: false,
        message: "Resident ID is required. Please ensure you are registered as a resident.",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Get building_id from resident
    const resident = await prisma.residents.findUnique({
      where: { resident_id: parseInt(targetResidentId) },
      select: { building_id: true },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    if (!resident.building_id) {
      return res.status(400).json({
        success: false,
        message: "Resident must be assigned to a building",
      });
    }

    const complaint = await prisma.complaints.create({
      data: {
        resident_id: parseInt(targetResidentId),
        building_id: resident.building_id,
        title,
        description,
        category: category || null,
        priority: priority || "Medium",
        status: "Pending",
      },
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to, priority } = req.body;

    const complaint = await prisma.complaints.findUnique({
      where: { complaint_id: parseInt(id) },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const updatedComplaint = await prisma.complaints.update({
      where: { complaint_id: parseInt(id) },
      data: {
        status: status || complaint.status,
        assigned_to: assigned_to !== undefined ? (assigned_to ? parseInt(assigned_to) : null) : complaint.assigned_to,
        priority: priority || complaint.priority,
      },
    });

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaints.findUnique({
      where: { complaint_id: parseInt(id) },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await prisma.complaints.delete({
      where: { complaint_id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete Complaint Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { 
  getComplaints, 
  getComplaintsByResidentId,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
