import { describe, it, expect } from "vitest";
import apiClient from "./api";

describe("apiClient wrapper", () => {
  it("delegates getApplications to mockApi and returns structure", async () => {
    const res = await apiClient.getApplications({});
    expect(res.success).toBe(true);
    expect(res.data).toHaveProperty("applications");
  });

  it("can generate ids and create student record via apiClient", async () => {
    const appsRes = await apiClient.getApplications({});
    const app = appsRes.data!.applications[0];
    const gid = await apiClient.generateApplicationIds(app.id);
    expect(gid.success).toBe(true);
    const student = await apiClient.createStudentRecord(app.id, { university_id: gid.data!.university_id, ugc_id: gid.data!.ugc_id });
    expect(student.success).toBe(true);
  });
});
