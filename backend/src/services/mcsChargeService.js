const prisma = require("../config/prisma");

/**
 * Calculate MCS-compliant charges for a flat/unit based on Maharashtra Co-operative Societies Rules
 */
class MCSService {
  /**
   * Calculate monthly charges for a resident based on MCS rules
   */
  static async calculateMonthlyCharges(residentId, month, year) {
    try {
      // Get resident details with unit and building information
      const resident = await prisma.residents.findUnique({
        where: { resident_id: residentId },
        include: {
          unit: true,
          building: true,
        },
      });

      if (!resident || !resident.unit || !resident.building) {
        throw new Error("Resident, unit, or building information not found");
      }

      const building = resident.building;
      const unit = resident.unit;

      // Get total units in building for service charge calculation
      const totalUnits = await prisma.units.count({
        where: { building_id: building.building_id },
      });

      // Calculate individual charges
      const charges = {
        service_charge: this.calculateServiceCharge(building, totalUnits),
        property_tax: this.calculatePropertyTax(building, unit),
        water_charge: this.calculateWaterCharge(building, unit),
        lift_maintenance: this.calculateLiftMaintenance(building, totalUnits),
        parking_charge: this.calculateParkingCharge(building, unit),
        sinking_fund: this.calculateSinkingFund(building, unit),
        repair_fund: this.calculateRepairFund(building, unit),
        major_repair_fund: this.calculateMajorRepairFund(building, unit),
        education_fund: this.calculateEducationFund(building),
        non_occupancy_charge: this.calculateNonOccupancyCharge(building, unit),
      };

      // Calculate total
      const totalAmount = Object.values(charges).reduce((sum, amount) => sum + (amount || 0), 0);

      return {
        charges,
        totalAmount,
        building_name: building.building_name,
        unit_number: unit.unit_number,
      };
    } catch (error) {
      console.error("MCS Charge Calculation Error:", error);
      throw error;
    }
  }

  /**
   * Service Charge - equally divided by number of units/flats
   */
  static calculateServiceCharge(building, totalUnits) {
    if (!building.service_charge_per_unit || totalUnits === 0) return 0;
    return Number(building.service_charge_per_unit);
  }

  /**
   * Property Tax - based on carpet area of each unit/flat
   * (For common area, on the basis of carpet area)
   */
  static calculatePropertyTax(building, unit) {
    // This would typically come from municipal assessment
    // For now, calculate proportionally based on carpet area
    if (!unit.carpet_area) return 0;
    
    // Assuming property tax is stored in building settings or calculated per sq ft
    const propertyTaxPerSqFt = building.property_tax_per_sq_ft || 0;
    return Number(unit.carpet_area) * Number(propertyTaxPerSqFt);
  }

  /**
   * Water Charges - based on total number and size of inlets/taps
   */
  static calculateWaterCharge(building, unit) {
    if (!unit.water_taps || !building.water_charge_per_tap) return 0;
    return Number(unit.water_taps) * Number(building.water_charge_per_tap);
  }

  /**
   * Lift Repair/Maintenance - equally divided by units where lift is provided
   */
  static calculateLiftMaintenance(building, totalUnits) {
    if (!building.lift_maintenance_per_unit || totalUnits === 0) return 0;
    return Number(building.lift_maintenance_per_unit);
  }

  /**
   * Car Parking Charges - at the rate fixed by general body
   */
  static calculateParkingCharge(building, unit) {
    if (!unit.parking_slots || !building.parking_charge) return 0;
    return Number(unit.parking_slots) * Number(building.parking_charge);
  }

  /**
   * Sinking Fund - minimum 0.25% per annum of construction cost
   */
  static calculateSinkingFund(building, unit) {
    if (!unit.construction_cost || !building.sinking_fund_rate) return 0;
    
    const annualRate = Number(building.sinking_fund_rate) / 100; // Convert percentage to decimal
    const annualAmount = Number(unit.construction_cost) * annualRate;
    return Math.round(annualAmount / 12); // Monthly amount
  }

  /**
   * Repair and Maintenance Fund - minimum 0.75% per annum of construction cost
   */
  static calculateRepairFund(building, unit) {
    if (!unit.construction_cost || !building.repair_fund_rate) return 0;
    
    const annualRate = Number(building.repair_fund_rate) / 100;
    const annualAmount = Number(unit.construction_cost) * annualRate;
    return Math.round(annualAmount / 12); // Monthly amount
  }

  /**
   * Major Repair Fund - based on carpet area
   */
  static calculateMajorRepairFund(building, unit) {
    if (!unit.carpet_area || !building.major_repair_rate) return 0;
    return Number(unit.carpet_area) * Number(building.major_repair_rate);
  }

  /**
   * Education and Training Fund - Rs. 10 per member per month
   */
  static calculateEducationFund(building) {
    return Number(building.education_fund_rate) || 10;
  }

  /**
   * Non-Occupancy Charges - 10% of service charges
   */
  static calculateNonOccupancyCharge(building, unit) {
    if (unit.is_occupied) return 0; // Only for non-occupied units
    
    const serviceCharge = this.calculateServiceCharge(building, 1); // Per unit
    const nonOccupancyRate = Number(building.non_occupancy_rate) / 100;
    return serviceCharge * nonOccupancyRate;
  }

  /**
   * Calculate late payment interest (max 12% per annum simple interest)
   */
  static calculateLatePaymentInterest(principalAmount, daysLate, interestRate) {
    if (!principalAmount || daysLate <= 0) return 0;
    
    const rate = Math.min(interestRate || 12, 12); // Max 12% as per MCS rules
    const annualRate = rate / 100;
    const dailyRate = annualRate / 365;
    
    return Math.round(principalAmount * dailyRate * daysLate);
  }

  /**
   * Create payment with detailed charge breakdown
   */
  static async createPaymentWithBreakdown(residentId, month, year, dueDate) {
    try {
      // Calculate charges
      const { charges, totalAmount } = await this.calculateMonthlyCharges(residentId, month, year);

      // Get resident info
      const resident = await prisma.residents.findUnique({
        where: { resident_id: residentId },
        include: { unit: true },
      });

      // Create payment record
      const payment = await prisma.payments.create({
        data: {
          resident_id: residentId,
          building_id: resident.unit.building_id,
          amount: totalAmount,
          month: month,
          year: year,
          payment_status: "Pending",
          payment_method: null,
          due_date: dueDate,
          is_late: new Date() > new Date(dueDate),
          // Store individual charges
          service_charge: charges.service_charge,
          property_tax: charges.property_tax,
          water_charge: charges.water_charge,
          lift_maintenance: charges.lift_maintenance,
          parking_charge: charges.parking_charge,
          sinking_fund: charges.sinking_fund,
          repair_fund: charges.repair_fund,
          major_repair_fund: charges.major_repair_fund,
          education_fund: charges.education_fund,
          non_occupancy_charge: charges.non_occupancy_charge,
        },
      });

      // Create detailed charge breakdown records
      const chargeMappings = [
        { type: "service_charge", name: "Service Charge", amount: charges.service_charge },
        { type: "property_tax", name: "Property Tax", amount: charges.property_tax },
        { type: "water_charge", name: "Water Charges", amount: charges.water_charge },
        { type: "lift_maintenance", name: "Lift Maintenance", amount: charges.lift_maintenance },
        { type: "parking_charge", name: "Parking Charges", amount: charges.parking_charge },
        { type: "sinking_fund", name: "Sinking Fund", amount: charges.sinking_fund },
        { type: "repair_fund", name: "Repair & Maintenance Fund", amount: charges.repair_fund },
        { type: "major_repair_fund", name: "Major Repair Fund", amount: charges.major_repair_fund },
        { type: "education_fund", name: "Education & Training Fund", amount: charges.education_fund },
        { type: "non_occupancy_charge", name: "Non-Occupancy Charges", amount: charges.non_occupancy_charge },
      ];

      for (const charge of chargeMappings) {
        if (charge.amount > 0) {
          await prisma.payment_charge_breakdowns.create({
            data: {
              payment_id: payment.payment_id,
              charge_type: charge.type,
              charge_name: charge.name,
              amount: charge.amount,
              calculation_basis: this.getCalculationBasis(charge.type),
            },
          });
        }
      }

      return payment;
    } catch (error) {
      console.error("Payment Creation with Breakdown Error:", error);
      throw error;
    }
  }

  /**
   * Get calculation basis description for each charge type
   */
  static getCalculationBasis(chargeType) {
    const basis = {
      service_charge: "Equally divided by number of units/flats",
      property_tax: "Based on carpet area of each unit/flat",
      water_charge: "Based on number and size of inlets/taps",
      lift_maintenance: "Equally divided by units with lift facility",
      parking_charge: "Per parking slot at rate fixed by general body",
      sinking_fund: "Minimum 0.25% per annum of construction cost",
      repair_fund: "Minimum 0.75% per annum of construction cost",
      major_repair_fund: "Based on carpet area at rate fixed by general body",
      education_fund: "Rs. 10 per member per month",
      non_occupancy_charge: "10% of service charges for non-occupied units",
    };
    return basis[chargeType] || "As per society bye-laws";
  }

  /**
   * Update building MCS configuration
   */
  static async updateBuildingMCSConfig(buildingId, config) {
    try {
      return await prisma.buildings.update({
        where: { building_id: buildingId },
        data: {
          sinking_fund_rate: config.sinking_fund_rate,
          repair_fund_rate: config.repair_fund_rate,
          education_fund_rate: config.education_fund_rate,
          major_repair_rate: config.major_repair_rate,
          service_charge_per_unit: config.service_charge_per_unit,
          parking_charge: config.parking_charge,
          late_payment_interest_rate: config.late_payment_interest_rate,
          non_occupancy_rate: config.non_occupancy_rate,
        },
      });
    } catch (error) {
      console.error("Building MCS Config Update Error:", error);
      throw error;
    }
  }
}

module.exports = MCSService;