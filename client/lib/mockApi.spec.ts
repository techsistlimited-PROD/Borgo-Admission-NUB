import { describe, it, expect, beforeEach } from "vitest";
import { mockApi } from "./mockApi";

describe("mockApi basic operations", () => {
  beforeEach(() => {
    // Reset any mutable state if needed by re-creating mockApi is not possible here,
    // but mockApi has in-memory arrays; for deterministic tests we won't mutate global too much.
  });

  it("returns applications and supports search filter", async () => {
    const res = await mockApi.getApplications({});
    expect(res.success).toBe(true);
    expect(res.data).toHaveProperty("applications");
    const apps = res.data!.applications;
    expect(Array.isArray(apps)).toBe(true);

    const searchRes = await mockApi.getApplications({ search: "john doe" });
    expect(searchRes.success).toBe(true);
    expect(searchRes.data!.applications.every((a: any) => a.applicant_name.toLowerCase().includes("john" ) || a.email.toLowerCase().includes("john"))).toBe(true);
  });

  it("can update application status and generate student id on approve", async () => {
    // Create a new application so tests don't depend on existing ones
    const createRes = await mockApi.createApplication({
      first_name: "Test",
      last_name: "Student",
      email: "teststudent@example.com",
      phone: "+8801000000000",
      program_code: "CSE101",
      program_name: "CSE",
      department_code: "CSE",
      department_name: "Computer",
      campus: "Main Campus",
      semester: "Spring 2024",
    });

    expect(createRes.success).toBe(true);
    const app = createRes.data!.application;

    const updateRes = await mockApi.updateApplicationStatus(app.id, "approved");
    expect(updateRes.success).toBe(true);

    // Ensure student_id was generated
    const apps = await mockApi.getApplications({ search: app.applicant_name });
    const found = apps.data!.applications.find((a: any) => a.id === app.id);
    expect(found).toBeDefined();
    expect(found.student_id || found.university_id).toBeTruthy();
  });

  it("generates IDs and creates student records and MR", async () => {
    const res = await mockApi.getApplications({});
    const app = res.data!.applications[0];
    expect(app).toBeDefined();

    const gid = await mockApi.generateApplicationIds(app.id);
    expect(gid.success).toBe(true);
    expect(gid.data).toHaveProperty("university_id");

    const studentRes = await mockApi.createStudentRecord(app.id, { university_id: gid.data!.university_id, ugc_id: gid.data!.ugc_id, batch: gid.data!.batch });
    expect(studentRes.success).toBe(true);
    expect(studentRes.data!.student).toHaveProperty("student_id");

    const mr = await mockApi.generateMoneyReceipt(app.id, 5000);
    expect(mr.success).toBe(true);
    expect(mr.data).toHaveProperty("mr_number");
    expect(mr.data).toHaveProperty("receipt_url");
  });

  it("visitors CRUD works", async () => {
    const create = await mockApi.createVisitor({ visit_date: "2024-02-15", campus: "Main Campus", visitor_name: "Visitor X", district: "Dhaka", no_of_visitors: 2, contact_number: "+880111", interested_in: "CSE101", remarks: "Test" });
    expect(create.success).toBe(true);
    const v = create.data!.visitor;

    const list = await mockApi.getVisitors({ search: "Visitor X" });
    expect(list.success).toBe(true);
    expect(list.data!.visitors.some((it:any)=>it.id===v.id)).toBe(true);

    const update = await mockApi.updateVisitor(v.id, { remarks: "Updated" });
    expect(update.success).toBe(true);
    expect(update.data!.visitor.remarks).toBe("Updated");

    const del = await mockApi.deleteVisitor(v.id);
    expect(del.success).toBe(true);
  });

  it("referrers list is available", async () => {
    const r = await mockApi.getReferrers();
    expect(r.success).toBe(true);
    expect(Array.isArray(r.data!.referrers)).toBe(true);
  });
});
