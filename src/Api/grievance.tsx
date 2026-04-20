// // /**
// //  * src/Api/grievance.tsx
// //  * 
// //  * All API functions for the Grievances feature.
// //  * Drop this file into: src/Api/grievance.tsx
// //  */

// // /* ── Types ─────────────────────────────────────────────────────────────────── */

// // export type GrievancePriority = "Low" | "Medium" | "High" | "Critical";
// // export type GrievanceStatus   = "Open" | "In Progress" | "Resolved" | "Closed";
// // export type GrievanceType     =
// //     | "Data Access Request"
// //     | "Data Correction Request"
// //     | "Data Deletion / Erasure"
// //     | "Consent Withdrawal"
// //     | "Data Breach Concern"
// //     | "Unauthorised Processing"
// //     | "Data Portability"
// //     | "Other";

// // export interface Resolution {
// //     text: string;
// //     resolvedBy: string;
// //     resolvedAt: string;
// // }

// // export interface Grievance {
// //     Id: number;
// //     ConsentId: string;
// //     UserName: string;
// //     UserEmail: string;
// //     UserMobile: string;
// //     IssueType: GrievanceType;
// //     IssueDescription: string;
// //     Priority: GrievancePriority;
// //     Status: GrievanceStatus;
// //     FiledOn: string;
// //     FormName: string;
// //     Resolution?: Resolution | null;
// // }

// // export interface GrievancePayload {
// //     ConsentId: string;
// //     UserName: string;
// //     UserEmail: string;
// //     UserMobile: string;
// //     IssueType: GrievanceType;
// //     IssueDescription: string;
// //     Priority: GrievancePriority;
// //     FormId?: number;
// // }

// // export interface ResolvePayload {
// //     GrievanceId: number;
// //     ResolutionNote: string;
// //     ResolvedBy: string;
// // }

// // export interface ApiResponse<T = any> {
// //     responseCode: number;
// //     responseStatus: boolean;
// //     responseErrorType: string;
// //     responseMessage: string;
// //     noOfRecord: number;
// //     data: T;
// // }

// // /* ── Helpers ────────────────────────────────────────────────────────────────── */

// // const getHeaders = (): HeadersInit => {
// //     const apiKey  = import.meta.env.VITE_API_KEY;
// //     const orgCode = localStorage.getItem("ORGCODE") || "";
// //     return {
// //         "Content-Type": "application/json",
// //         "X-API-KEY": apiKey,
// //         "X-ORG-CODE": orgCode,
// //     };
// // };

// // const base = () => import.meta.env.VITE_API_BASE_URL;

// // /* ── Get Grievance List ─────────────────────────────────────────────────────── */
// // // Called by the Organization dashboard to list all grievances for the org.

// // export const getGrievanceList = async (params?: {
// //     pageNumber?: number;
// //     pageSize?: number;
// //     status?: GrievanceStatus | "All";
// //     priority?: GrievancePriority | "All";
// // }): Promise<ApiResponse<Grievance[]>> => {
// //     const qs = new URLSearchParams();
// //     if (params?.pageNumber) qs.set("PageNumber", String(params.pageNumber));
// //     if (params?.pageSize)   qs.set("PageSize",   String(params.pageSize));
// //     if (params?.status && params.status !== "All")   qs.set("Status",   params.status);
// //     if (params?.priority && params.priority !== "All") qs.set("Priority", params.priority);

// //     const res = await fetch(`${base()}/api/Grievance/GetList?${qs.toString()}`, {
// //         method: "GET",
// //         headers: getHeaders(),
// //     });
// //     if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
// //     return res.json();
// // };

// // /* ── Get Grievance By ID ────────────────────────────────────────────────────── */

// // export const getGrievanceById = async (id: number): Promise<ApiResponse<Grievance>> => {
// //     const res = await fetch(`${base()}/api/Grievance/GetById?Id=${id}`, {
// //         method: "GET",
// //         headers: getHeaders(),
// //     });
// //     if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
// //     return res.json();
// // };

// // /* ── Submit a Grievance (called from the public/user side) ──────────────────── */

// // export const submitGrievance = async (
// //     payload: GrievancePayload
// // ): Promise<ApiResponse<{ GrievanceId: number }>> => {
// //     const res = await fetch(`${base()}/api/Grievance/Submit`, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             "X-API-KEY": import.meta.env.VITE_API_KEY,
// //         },
// //         body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
// //     const json = await res.json();
// //     if (json.responseCode !== 101) throw new Error(json.responseMessage || "Submit failed");
// //     return json;
// // };

// // /* ── Resolve Grievance ──────────────────────────────────────────────────────── */

// // export const resolveGrievance = async (
// //     payload: ResolvePayload
// // ): Promise<ApiResponse> => {
// //     const res = await fetch(`${base()}/api/Grievance/Resolve`, {
// //         method: "PUT",
// //         headers: getHeaders(),
// //         body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) throw new Error(`Resolve failed: ${res.status}`);
// //     const json = await res.json();
// //     if (json.responseCode !== 101) throw new Error(json.responseMessage || "Resolve failed");
// //     return json;
// // };

// // /* ── Update Status ──────────────────────────────────────────────────────────── */

// // export const updateGrievanceStatus = async (
// //     id: number,
// //     status: GrievanceStatus
// // ): Promise<ApiResponse> => {
// //     const res = await fetch(`${base()}/api/Grievance/UpdateStatus`, {
// //         method: "PUT",
// //         headers: getHeaders(),
// //         body: JSON.stringify({ Id: id, Status: status }),
// //     });
// //     if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
// //     return res.json();
// // };



/**
 * src/Api/grievance.tsx
 *
 * All API functions for the Grievances feature.
 *
 * Key endpoints:
 *   GET  /api/Grievance/GetList         ← Admin: list all grievances
 *   GET  /api/Grievance/GetById         ← Admin: get single grievance
 *   POST /api/Grievance/Submit          ← User: submit a new grievance
 *   PUT  /api/Grievance/Resolve         ← Admin: resolve + email user
 *   PUT  /api/Grievance/UpdateStatus    ← Admin: update status only
 */

/* ── Types ─────────────────────────────────────────────────────────── */

export type GrievancePriority = "Low" | "Medium" | "High" | "Critical";
export type GrievanceStatus   = "Open" | "In Progress" | "Resolved" | "Closed";
export type GrievanceType     =
    | "Data Access Request"
    | "Data Correction Request"
    | "Data Deletion / Erasure"
    | "Consent Withdrawal"
    | "Data Breach Concern"
    | "Unauthorised Processing"
    | "Data Portability"
    | "Other";

export interface Resolution {
    text:       string;
    resolvedBy: string;
    resolvedAt: string;
}

export interface Grievance {
    Id:               number;
    ConsentId:        string;
    UserName:         string;
    UserEmail:        string;
    UserMobile:       string;
    IssueType:        GrievanceType;
    IssueDescription: string;
    Priority:         GrievancePriority;
    Status:           GrievanceStatus;
    FiledOn:          string;          // ISO date string
    FormName:         string;
    Resolution?:      Resolution | null;
}

/**
 * Payload sent when a user submits a grievance from myFormDetail.tsx
 */
export interface GrievancePayload {
    ConsentId:        string;
    UserName:         string;
    UserEmail:        string;
    UserMobile:       string;
    IssueType:        GrievanceType;
    IssueDescription: string;
    Priority:         GrievancePriority;
    FormId?:          number;
}

/**
 * Payload sent when an admin resolves a grievance.
 * The backend is responsible for emailing the ResolutionNote to the user.
 */
export interface ResolvePayload {
    GrievanceId:    number;
    ResolutionNote: string;  // This text is emailed to the user
    ResolvedBy:     string;
}

export interface ApiResponse<T = any> {
    responseCode:       number;
    responseStatus:     boolean;
    responseErrorType:  string;
    responseMessage:    string;
    noOfRecord:         number;
    data:               T;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

/**
 * Returns headers for authenticated admin API calls.
 * Uses X-API-KEY + X-ORG-CODE from env / localStorage.
 */
const getHeaders = (): HeadersInit => {
    const apiKey  = import.meta.env.VITE_API_KEY  || "";
    const orgCode = localStorage.getItem("ORGCODE") || "";
    return {
        "Content-Type": "application/json",
        "X-API-KEY":    apiKey,
        "X-ORG-CODE":   orgCode,
    };
};

/**
 * Returns headers for PUBLIC (user-facing) API calls.
 * No org-code required — only API key.
 */
const getPublicHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    "X-API-KEY":    import.meta.env.VITE_API_KEY || "",
});

const base = (): string => import.meta.env.VITE_API_BASE_URL || "";

/* ── Get Grievance List (Admin) ───────────────────────────────────── */

export const getGrievanceList = async (params?: {
    pageNumber?: number;
    pageSize?:   number;
    status?:     GrievanceStatus | "All";
    priority?:   GrievancePriority | "All";
}): Promise<ApiResponse<Grievance[]>> => {
    const qs = new URLSearchParams();
    if (params?.pageNumber)                              qs.set("PageNumber", String(params.pageNumber));
    if (params?.pageSize)                                qs.set("PageSize",   String(params.pageSize));
    if (params?.status   && params.status   !== "All")  qs.set("Status",     params.status);
    if (params?.priority && params.priority !== "All")  qs.set("Priority",   params.priority);

    const res = await fetch(`${base()}/api/Grievance/GetList?${qs.toString()}`, {
        method:  "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
};

/* ── Get Grievance By ID (Admin) ──────────────────────────────────── */

export const getGrievanceById = async (
    id: number
): Promise<ApiResponse<Grievance>> => {
    const res = await fetch(`${base()}/api/Grievance/GetById?Id=${id}`, {
        method:  "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
};

/* ── Submit Grievance (User / Public) ─────────────────────────────── */
/**
 * Called from myFormDetail.tsx when the user clicks the Grievance button.
 * No admin auth headers — public endpoint.
 */
export const submitGrievance = async (
    payload: GrievancePayload
): Promise<ApiResponse<{ GrievanceId: number }>> => {
    const res = await fetch(`${base()}/api/Grievance/Submit`, {
        method:  "POST",
        headers: getPublicHeaders(),
        body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
    const json = await res.json();
    if (json.responseCode !== 101) throw new Error(json.responseMessage || "Submit failed");
    return json;
};

/* ── Resolve Grievance (Admin) ────────────────────────────────────── */
/**
 * Called from GrievancesPage when admin sends a Resolution Note.
 *
 * The BACKEND is responsible for:
 *   1. Updating the grievance status to "Resolved"
 *   2. Storing the ResolutionNote as an audit record
 *   3. Emailing the ResolutionNote to the user's registered email
 *
 * Backend endpoint: PUT /api/Grievance/Resolve
 * Expected request body:
 * {
 *   "GrievanceId":    1001,
 *   "ResolutionNote": "Your request has been processed...",
 *   "ResolvedBy":     "DPO — Meena Joshi"
 * }
 */
export const resolveGrievance = async (
    payload: ResolvePayload
): Promise<ApiResponse> => {
    const res = await fetch(`${base()}/api/Grievance/Resolve`, {
        method:  "PUT",
        headers: getHeaders(),
        body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Resolve failed: ${res.status}`);
    const json = await res.json();
    if (json.responseCode !== 101) throw new Error(json.responseMessage || "Resolve failed");
    return json;
};

/* ── Update Grievance Status (Admin) ─────────────────────────────── */

export const updateGrievanceStatus = async (
    id:     number,
    status: GrievanceStatus
): Promise<ApiResponse> => {
    const res = await fetch(`${base()}/api/Grievance/UpdateStatus`, {
        method:  "PUT",
        headers: getHeaders(),
        body:    JSON.stringify({ Id: id, Status: status }),
    });
    if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
    return res.json();
};

