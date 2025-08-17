// Database adapter to switch between SQLite and Supabase based on environment
import {
  dbGet as sqliteGet,
  dbAll as sqliteAll,
  dbRun as sqliteRun,
} from "./config.js";

// Dynamic database functions that choose the right implementation
export const adaptedGet = async (
  sqlOrTable: string,
  params?: any,
): Promise<any> => {
  const databaseType = process.env.DATABASE_TYPE || "sqlite";

  if (databaseType === "supabase") {
    const { supabaseGet } = await import("./supabase.js");

    // For Supabase, we need to convert SQL queries to Supabase queries
    // This is a simplified adapter - in production you'd want more sophisticated conversion
    if (typeof sqlOrTable === "string" && sqlOrTable.includes("SELECT")) {
      // Handle raw SQL - this is complex, so we'll throw an error for now
      throw new Error(
        "Raw SQL queries not supported with Supabase adapter. Use table-based queries.",
      );
    }

    return await supabaseGet(sqlOrTable, params);
  } else {
    return await sqliteGet(sqlOrTable, params);
  }
};

export const adaptedAll = async (
  sqlOrTable: string,
  params?: any,
): Promise<any[]> => {
  const databaseType = process.env.DATABASE_TYPE || "sqlite";

  if (databaseType === "supabase") {
    const { supabaseAll } = await import("./supabase.js");

    if (typeof sqlOrTable === "string" && sqlOrTable.includes("SELECT")) {
      throw new Error(
        "Raw SQL queries not supported with Supabase adapter. Use table-based queries.",
      );
    }

    return await supabaseAll(sqlOrTable, params);
  } else {
    return await sqliteAll(sqlOrTable, params);
  }
};

export const adaptedRun = async (
  sqlOrTable: string,
  params?: any,
): Promise<any> => {
  const databaseType = process.env.DATABASE_TYPE || "sqlite";

  if (databaseType === "supabase") {
    const { supabaseRun } = await import("./supabase.js");

    if (typeof sqlOrTable === "string" && sqlOrTable.includes("INSERT")) {
      throw new Error(
        "Raw SQL queries not supported with Supabase adapter. Use operation-based queries.",
      );
    }

    return await supabaseRun(sqlOrTable, "insert", params);
  } else {
    return await sqliteRun(sqlOrTable, params);
  }
};

// Helper function to create application record for Supabase
export const createApplicationRecord = async (applicationData: any) => {
  const databaseType = process.env.DATABASE_TYPE || "sqlite";

  if (databaseType === "supabase") {
    const { supabaseRun } = await import("./supabase.js");

    // Generate tracking ID
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const tracking_id = `NU${year}${randomNum.toString().padStart(6, "0")}`;

    const applicationRecord = {
      tracking_id: tracking_id,
      status: "pending",
      program: applicationData.program,
      department: applicationData.department,
      session: applicationData.session || "Spring 2024",
      campus: applicationData.campus || "main",
      first_name: applicationData.firstName,
      last_name: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone,
      date_of_birth: applicationData.dateOfBirth,
      gender: applicationData.gender,
      address: applicationData.address,
      city: applicationData.city,
      postal_code: applicationData.postalCode,
      country: applicationData.country || "Bangladesh",
      guardian_name: applicationData.guardianName,
      guardian_phone: applicationData.guardianPhone,
      guardian_relation: applicationData.guardianRelation,
      ssc_institution: applicationData.sscInstitution,
      ssc_year: applicationData.sscYear,
      ssc_gpa: applicationData.sscGPA,
      hsc_institution: applicationData.hscInstitution,
      hsc_year: applicationData.hscYear,
      hsc_gpa: applicationData.hscGPA,
      total_cost: applicationData.totalCost || 0,
      final_amount: applicationData.finalAmount || 0,
      referrer_id: applicationData.referrerId,
      referrer_name: applicationData.referrerName,
    };

    const result = await supabaseRun(
      "applications",
      "insert",
      applicationRecord,
    );
    return { tracking_id, result };
  } else {
    // Use existing SQLite implementation
    const { v4: uuidv4 } = await import("uuid");

    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const tracking_id = `NU${year}${randomNum.toString().padStart(6, "0")}`;
    const applicationUuid = uuidv4();

    await sqliteRun(
      `
      INSERT INTO applications (
        uuid, user_id, tracking_id, status, program, department, session, campus,
        first_name, last_name, email, phone, date_of_birth, gender,
        address, city, postal_code, country, guardian_name,
        guardian_phone, guardian_relation, ssc_institution, ssc_year,
        ssc_gpa, hsc_institution, hsc_year, hsc_gpa, total_cost,
        final_amount, referrer_id, referrer_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        applicationUuid,
        null, // user_id
        tracking_id,
        "pending",
        applicationData.program,
        applicationData.department,
        applicationData.session || "Spring 2024",
        applicationData.campus || "main",
        applicationData.firstName,
        applicationData.lastName,
        applicationData.email,
        applicationData.phone,
        applicationData.dateOfBirth,
        applicationData.gender,
        applicationData.address,
        applicationData.city,
        applicationData.postalCode,
        applicationData.country || "Bangladesh",
        applicationData.guardianName,
        applicationData.guardianPhone,
        applicationData.guardianRelation,
        applicationData.sscInstitution,
        applicationData.sscYear,
        applicationData.sscGPA,
        applicationData.hscInstitution,
        applicationData.hscYear,
        applicationData.hscGPA,
        applicationData.totalCost || 0,
        applicationData.finalAmount || 0,
        applicationData.referrerId,
        applicationData.referrerName,
      ],
    );

    return { tracking_id };
  }
};
