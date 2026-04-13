export interface DashboardActivityLog {
    [key: string]: any;
}

export interface AdminDashboardData {
    roleId: number;
    totalUsers: number;
    totalForms: number;
    totalFormResponse: number;
    totalConsentRemoveRequest: number;
    totalPendingConsentRemoveRequest: number;
    totalConsentRequestActionTaken: number;
    totalApprovedActionTaken: number;
    totalRejectedActionTaken: number;
    activityLogs: DashboardActivityLog[];
}

export interface AdminDashboardApiResponse {
    responseCode: number;
    responseStatus: boolean;
    responseErrorType: string;
    responseMessage: string;
    noOfRecord: number;
    data: AdminDashboardData | null;
}

export const getAdminDashboard = async (): Promise<AdminDashboardData | null> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    const adminCode = localStorage.getItem("ADCODE");
    if (!adminCode) throw new Error("Admin code not found. Please login again.");

    if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL");
    if (!apiKey) throw new Error("Missing VITE_API_KEY");

    const response = await fetch(`${baseUrl}/api/Admin/Dashboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
            "X-ADMIN-CODE": adminCode,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    const result: AdminDashboardApiResponse = await response.json();

    if (result.responseCode !== 101) {
        throw new Error(result.responseMessage || "Failed to fetch dashboard data");
    }

    return result.data ?? null;
};