import { apiUrl } from "@/config/api";
import { getHrOrg, hrHeaders, hrOrAdminHeaders, setHrSession, type HrOrganization, type HrUser } from "./auth";

type Envelope<T> = { success: boolean; message?: string; data: T; error?: string };

async function hrCall<T>(path: string, init: RequestInit = {}, headers: HeadersInit = hrHeaders()): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { ...headers, ...(init.headers ?? {}) },
  });
  const json = (await res.json().catch(() => ({}))) as Envelope<T> & { error?: string };
  if (!res.ok || json.success === false) {
    throw new Error(json.message || json.error || `Request failed (${res.status})`);
  }
  return json.data;
}

export type HrEmployee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  personalEmail?: string;
  departmentId?: string | null;
  designationId?: string | null;
  employmentStatus: string;
  employmentType: string;
  dateOfJoining?: string;
  workLocation?: string;
};

export type HrDepartment = { id: string; name: string; code?: string; description?: string };
export type HrDesignation = { id: string; name: string; code?: string; level?: number };
export type HrAttendance = {
  id: string;
  employeeId?: string;
  date: string;
  status: string;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  workMinutes?: number;
};
export type HrLeaveType = { id: string; name: string; code: string; daysPerYear: number; isPaid: boolean };
export type HrLeaveRequest = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  createdAt?: string;
};

export const hrRegister = async (body: {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}) => {
  const data = await hrCall<{ token: string; user: HrUser; organization: HrOrganization }>(
    "/api/hr/auth/register",
    { method: "POST", body: JSON.stringify(body) },
    { "Content-Type": "application/json" },
  );
  setHrSession(data.token, data.user, data.organization);
  return data;
};

export const hrLogin = async (body: { email: string; password: string }) => {
  const data = await hrCall<{ token: string; user: HrUser; organization: HrOrganization }>(
    "/api/hr/auth/login",
    { method: "POST", body: JSON.stringify(body) },
    { "Content-Type": "application/json" },
  );
  setHrSession(data.token, data.user, data.organization);
  return data;
};

export const hrMe = () =>
  hrCall<{ user: HrUser; employee: HrEmployee | null; organization: HrOrganization | null }>("/api/hr/auth/me");

export const fetchHrPlatformOverview = () =>
  hrCall<{ organizations: number; employees: number; users: number; leavePending: number }>(
    "/api/hr/platform/overview",
    {},
    hrOrAdminHeaders(),
  );

export const fetchHrOrganizations = () =>
  hrCall<{ items: HrOrganization[] }>("/api/hr/organizations", {}, hrOrAdminHeaders());

export const fetchHrDashboard = () => hrCall<{
  employees: number;
  presentToday: number;
  pendingLeave: number;
  departments: number;
  announcements: { id: string; title: string; body: string; createdAt: string }[];
}>("/api/hr/dashboard");

export const fetchHrOrganization = () => hrCall<HrOrganization>("/api/hr/organization");
export const updateHrOrganization = (body: Partial<HrOrganization>) =>
  hrCall<HrOrganization>("/api/hr/organization", { method: "PATCH", body: JSON.stringify(body) });

export const fetchDepartments = () => hrCall<{ items: HrDepartment[] }>("/api/hr/departments");
export const createDepartment = (body: { name: string; code?: string; description?: string }) =>
  hrCall<HrDepartment>("/api/hr/departments", { method: "POST", body: JSON.stringify(body) });

export const fetchDesignations = () => hrCall<{ items: HrDesignation[] }>("/api/hr/designations");
export const createDesignation = (body: { name: string; code?: string; level?: number }) =>
  hrCall<HrDesignation>("/api/hr/designations", { method: "POST", body: JSON.stringify(body) });

export const fetchEmployees = (q?: string) =>
  hrCall<{ items: HrEmployee[] }>(`/api/hr/employees${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const createEmployee = (body: Record<string, unknown>) =>
  hrCall<HrEmployee>("/api/hr/employees", { method: "POST", body: JSON.stringify(body) });
export const updateEmployee = (id: string, body: Record<string, unknown>) =>
  hrCall<HrEmployee>(`/api/hr/employees/${id}`, { method: "PATCH", body: JSON.stringify(body) });
export const fetchEmployee = (id: string) => hrCall<HrEmployee>(`/api/hr/employees/${id}`);

export const attendanceToday = () => hrCall<HrAttendance | null>("/api/hr/attendance/today");
export const checkIn = () => hrCall<HrAttendance>("/api/hr/attendance/check-in", { method: "POST", body: "{}" });
export const checkOut = () => hrCall<HrAttendance>("/api/hr/attendance/check-out", { method: "POST", body: "{}" });
export const fetchAttendance = () => hrCall<{ items: HrAttendance[] }>("/api/hr/attendance");

export const fetchLeaveTypes = () => hrCall<{ items: HrLeaveType[] }>("/api/hr/leave/types");
export const fetchLeaveRequests = (status?: string) =>
  hrCall<{ items: HrLeaveRequest[] }>(`/api/hr/leave/requests${status ? `?status=${status}` : ""}`);
export const createLeaveRequest = (body: {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  employeeId?: string;
}) => hrCall<HrLeaveRequest>("/api/hr/leave/requests", { method: "POST", body: JSON.stringify(body) });
export const reviewLeaveRequest = (id: string, status: "approved" | "rejected", reviewNote?: string) =>
  hrCall(`/api/hr/leave/requests/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ status, reviewNote }),
  });

export const fetchAnnouncements = () =>
  hrCall<{ items: { id: string; title: string; body: string; published: boolean; createdAt: string }[] }>(
    "/api/hr/announcements",
  );
export const createAnnouncement = (body: { title: string; body: string }) =>
  hrCall("/api/hr/announcements", { method: "POST", body: JSON.stringify(body) });

export const updateHrProfile = (body: { name?: string; phone?: string; profileImage?: string }) =>
  hrCall<HrUser>("/api/hr/users/profile", { method: "PATCH", body: JSON.stringify(body) });

export const currentOrgId = () => getHrOrg()?.id;
