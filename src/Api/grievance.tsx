/**
 * src/Api/grievance.tsx
 * Grievance API — fixed to match actual backend behavior.
 */

/* ── Types ─────────────────────────────────────────────────────────── */

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
export type GrievancePriority = "Low" | "Medium" | "High" | "Critical";

export interface Resolution {
    text:       string;
    resolvedBy: string;
    resolvedAt: string;
}

export interface GrievanceRaw {
    Id:           number;
    FormId:       number;
    ResponseId:   number;
    Subject:      string;
    Details:      string;
    ProblemImage?: string;
    PublicName?:   string;
    PublicMobile?: string;
    PublicEmail?:  string;
    Status?:       string;
    Priority?:     GrievancePriority;
    CreatedOn?:    string;
    UpdatedOn?:    string;
    TotalCount?:   number;
    AdminReply?:   string;
    AdminReplyOn?: string;
}

export interface Grievance {
    Id:               number;
    FormId:           number;
    ResponseId:       number;
    ConsentId:        string;
    UserName:         string;
    UserEmail:        string;
    UserMobile:       string;
    IssueType:        GrievanceType;
    IssueDescription: string;
    Priority:         GrievancePriority;
    Status:           GrievanceStatus;
    FiledOn:          string;
    FormName:         string;
    Resolution?:      Resolution | null;
}

export interface AddGrievancePayload {
    FormId:        number;
    ResponseId:    number;
    Subject:       string;
    Details:       string;
    PublicName?:   string;
    PublicMobile?: string;
    PublicEmail?:  string;
    ProblemImage?: File | null;
}

export interface AddAdminReplyPayload {
    GrievanceId:  number;
    ResponseId:   number;
    ReplyMessage: string;
    ReplyImage?:  File | null;
}

export interface ApiResponse<T = any> {
    responseCode:      number;
    responseStatus:    boolean;
    responseErrorType: string;
    responseMessage:   string;
    noOfRecord:        number;
    data:              T;
}

/* ── Helpers ────────────────────────────────────────────────────────── */

const getBase      = () => import.meta.env.VITE_API_BASE_URL || "";
const getApiKey    = () => import.meta.env.VITE_API_KEY      || "";
const getAdminCode = () => localStorage.getItem("ADCODE")    || "";
const getOrgCode   = () => localStorage.getItem("ORG_CODE")  || "";   // ✅ consistent key

// JSON headers for admin (GET requests)
const adminJsonHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    "X-API-KEY":    getApiKey(),
    "X-ADMIN-CODE": getAdminCode(),
});

// FormData headers for admin (POST multipart)
const adminFormHeaders = (): HeadersInit => ({
    "X-API-KEY":    getApiKey(),
    "X-ADMIN-CODE": getAdminCode(),
});

// FormData headers for public user (POST multipart — no admin code)
const publicFormHeaders = (): HeadersInit => ({
    "X-API-KEY":    getApiKey(),
    "X-ADMIN-CODE": getAdminCode(), // still needed to scope to correct org
});

/* ── Normalise raw → UI shape ──────────────────────────────────────── */

const STATUS_MAP: Record<string, GrievanceStatus> = {
    "Open":        "Open",
    "In Progress": "In Progress",
    "Resolved":    "Resolved",
    "Closed":      "Closed",
};

const normaliseGrievance = (raw: GrievanceRaw): Grievance => ({
    Id:               raw.Id,
    FormId:           raw.FormId,
    ResponseId:       raw.ResponseId,
    ConsentId:        `CNS-${raw.ResponseId}`,
    UserName:         raw.PublicName   || "Unknown",
    UserEmail:        raw.PublicEmail  || "",
    UserMobile:       raw.PublicMobile || "",
    IssueType:        (raw.Subject as GrievanceType) || "Other",
    IssueDescription: raw.Details      || "",
    Priority:         raw.Priority     || "Medium",
    Status:           STATUS_MAP[raw.Status || ""] || "Open",
    FiledOn:          raw.CreatedOn    || new Date().toISOString(),
    FormName:         `Form #${raw.FormId}`,
    Resolution: raw.AdminReply
        ? {
              text:       raw.AdminReply,
              resolvedBy: "Admin",
              resolvedAt: raw.AdminReplyOn || new Date().toISOString(),
          }
        : null,
});

/* ── Parse API data (handles both string and array) ────────────────── */
const parseData = (data: any): GrievanceRaw[] => {
    if (!data) return [];
    if (typeof data === "string") {
        try { return JSON.parse(data); } catch { return []; }
    }
    if (Array.isArray(data)) return data;
    return [];
};

/* ═══════════════════════════════════════════════════════════════════
   USER-SIDE: POST /api/Grievance/addGrievance  (multipart/form-data)
═══════════════════════════════════════════════════════════════════ */
export const addGrievance = async (
    payload: AddGrievancePayload
): Promise<ApiResponse> => {
    const fd = new FormData();
    fd.append("FormId",     String(payload.FormId));
    fd.append("ResponseId", String(payload.ResponseId));
    fd.append("Subject",    payload.Subject);
    fd.append("Details",    payload.Details);
    if (payload.PublicName)   fd.append("PublicName",   payload.PublicName);
    if (payload.PublicMobile) fd.append("PublicMobile", payload.PublicMobile);
    if (payload.PublicEmail)  fd.append("PublicEmail",  payload.PublicEmail);
    if (payload.ProblemImage) fd.append("ProblemImage", payload.ProblemImage);

    const res = await fetch(`${getBase()}/api/Grievance/addGrievance`, {
        method:  "POST",
        headers: publicFormHeaders(),
        body:    fd,
    });
    if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
    const json: ApiResponse = await res.json();
    if (json.responseCode !== 101)
        throw new Error(json.responseMessage || "Failed to submit grievance");
    return json;
};

/* ═══════════════════════════════════════════════════════════════════
   ADMIN-SIDE LIST
   ✅ FIX: Backend GET /api/Grievance/getGrievance requires Id.
   We fetch grievances by getting all form responses for the org
   and then fetching grievances per response via getGrievancesByResponse.
   
   If your backend supports a list endpoint in the future, swap fetchData
   in GrievancesPage to call that instead.
   
   For now: GET /api/Grievance/getGrievancesByResponse is used per response.
═══════════════════════════════════════════════════════════════════ */

/**
 * Fetch ALL form responses for the admin's org, then fetch grievances
 * for each response. Returns a flat list of all grievances.
 * 
 * This is needed because the backend has no "list all grievances" endpoint.
 */
export const getAllGrievancesForAdmin = async (): Promise<ApiResponse<Grievance[]>> => {
    const baseUrl   = getBase();
    const apiKey    = getApiKey();
    const adminCode = getAdminCode();

    if (!adminCode) throw new Error("Admin code not found. Please login again.");

    // Step 1: Fetch all form responses for this admin/org
    const formsRes = await fetch(
        `${baseUrl}/api/Form/Forms?status=Y&PageNumber=1&PageSize=1000&SortColumn=&SortOrder=DESC&StartDate=&EndDate=&SearchColumn=&SearchString=`,
        {
            method:  "GET",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY":    apiKey,
                "X-ADMIN-CODE": adminCode,
            },
        }
    );

    if (!formsRes.ok) throw new Error(`Forms fetch failed: ${formsRes.status}`);
    const formsJson = await formsRes.json();

    let formIds: number[] = [];
    if (formsJson.responseCode === 101 && formsJson.data) {
        const forms: any[] = parseData(formsJson.data);
        formIds = forms.map((f: any) => Number(f.Id)).filter(Boolean);
    }

    if (!formIds.length) {
        return { responseCode: 101, responseStatus: true, responseErrorType: "", responseMessage: "", noOfRecord: 0, data: [] };
    }

    // Step 2: For each form, fetch its responses
    const allResponseIds: Array<{ formId: number; responseId: number }> = [];

    await Promise.all(
        formIds.map(async (formId) => {
            try {
                const rRes = await fetch(
                    `${baseUrl}/api/Form/FormsResponseListByFormId?FormId=${formId}`,
                    {
                        method:  "GET",
                        headers: { "X-API-KEY": apiKey, "X-ADMIN-CODE": adminCode },
                    }
                );
                if (!rRes.ok) return;
                const rJson = await rRes.json();
                if (rJson.responseCode === 101 && rJson.data) {
                    const responses: any[] = parseData(rJson.data);
                    responses.forEach((r: any) => {
                        if (r.Id) allResponseIds.push({ formId, responseId: Number(r.Id) });
                    });
                }
            } catch { /* skip failed form */ }
        })
    );

    if (!allResponseIds.length) {
        return { responseCode: 101, responseStatus: true, responseErrorType: "", responseMessage: "", noOfRecord: 0, data: [] };
    }

    // Step 3: For each response, fetch grievances
    const allGrievances: Grievance[] = [];
    const seenIds = new Set<number>();

    await Promise.all(
        allResponseIds.map(async ({ formId, responseId }) => {
            try {
                const qs  = new URLSearchParams({ FormId: String(formId), ResponseId: String(responseId) });
                const gRes = await fetch(
                    `${baseUrl}/api/Grievance/getGrievancesByResponse?${qs}`,
                    {
                        method:  "GET",
                        headers: adminJsonHeaders(),
                    }
                );
                if (!gRes.ok) return;
                const gJson = await gRes.json();
                if (gJson.responseCode === 101 && gJson.data) {
                    const rawList: GrievanceRaw[] = parseData(gJson.data);
                    rawList.forEach((raw) => {
                        if (!seenIds.has(raw.Id)) {
                            seenIds.add(raw.Id);
                            allGrievances.push(normaliseGrievance(raw));
                        }
                    });
                }
            } catch { /* skip failed response */ }
        })
    );

    return {
        responseCode:      101,
        responseStatus:    true,
        responseErrorType: "",
        responseMessage:   "",
        noOfRecord:        allGrievances.length,
        data:              allGrievances,
    };
};

/* ── Kept for backward compat (GrievancesPage import) ─────────────── */
export const getGrievanceList = getAllGrievancesForAdmin;

/* ═══════════════════════════════════════════════════════════════════
   GET single grievance: GET /api/Grievance/getGrievance?Id=N
═══════════════════════════════════════════════════════════════════ */
export const getGrievanceById = async (id: number): Promise<Grievance | null> => {
    const res = await fetch(`${getBase()}/api/Grievance/getGrievance?Id=${id}`, {
        method:  "GET",
        headers: adminJsonHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    if (json.responseCode !== 101) return null;
    const rawList = parseData(json.data);
    return rawList.length ? normaliseGrievance(rawList[0]) : null;
};

/* ═══════════════════════════════════════════════════════════════════
   GET grievances by response: GET /api/Grievance/getGrievancesByResponse
═══════════════════════════════════════════════════════════════════ */
export const getGrievancesByResponse = async (
    formId: number,
    responseId: number
): Promise<Grievance[]> => {
    const qs = new URLSearchParams({
        FormId:     String(formId),
        ResponseId: String(responseId),
    });
    const res = await fetch(
        `${getBase()}/api/Grievance/getGrievancesByResponse?${qs}`,
        { method: "GET", headers: adminJsonHeaders() }
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    if (json.responseCode !== 101) return [];
    return parseData(json.data).map(normaliseGrievance);
};

/* ═══════════════════════════════════════════════════════════════════
   GET grievance history: GET /api/Grievance/getGrievanceHistory
═══════════════════════════════════════════════════════════════════ */
export const getGrievanceHistory = async (
    grievanceId: number,
    responseId:  number
): Promise<any[]> => {
    const qs = new URLSearchParams({
        GrievanceId: String(grievanceId),
        ResponseId:  String(responseId),
    });
    const res = await fetch(
        `${getBase()}/api/Grievance/getGrievanceHistory?${qs}`,
        { method: "GET", headers: adminJsonHeaders() }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.responseCode === 101 ? parseData(json.data) : [];
};

/* ═══════════════════════════════════════════════════════════════════
   POST /api/Grievance/addAdminReply  (multipart)
═══════════════════════════════════════════════════════════════════ */
export const addAdminReply = async (
    payload: AddAdminReplyPayload
): Promise<ApiResponse> => {
    const fd = new FormData();
    fd.append("GrievanceId",  String(payload.GrievanceId));
    fd.append("ResponseId",   String(payload.ResponseId));
    fd.append("ReplyMessage", payload.ReplyMessage);
    if (payload.ReplyImage) fd.append("ReplyImage", payload.ReplyImage);

    const res = await fetch(`${getBase()}/api/Grievance/addAdminReply`, {
        method:  "POST",
        headers: adminFormHeaders(),
        body:    fd,
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json: ApiResponse = await res.json();
    if (json.responseCode !== 101)
        throw new Error(json.responseMessage || "Failed to send reply");
    return json;
};

/* ═══════════════════════════════════════════════════════════════════
   POST /api/Grievance/addPublicReply  (multipart — user side)
═══════════════════════════════════════════════════════════════════ */
export const addPublicReply = async (payload: {
    GrievanceId:  number;
    ResponseId:   number;
    ReplyMessage: string;
    ReplyImage?:  File | null;
}): Promise<ApiResponse> => {
    const fd = new FormData();
    fd.append("GrievanceId",  String(payload.GrievanceId));
    fd.append("ResponseId",   String(payload.ResponseId));
    fd.append("ReplyMessage", payload.ReplyMessage);
    if (payload.ReplyImage) fd.append("ReplyImage", payload.ReplyImage);

    const res = await fetch(`${getBase()}/api/Grievance/addPublicReply`, {
        method:  "POST",
        headers: publicFormHeaders(),
        body:    fd,
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json: ApiResponse = await res.json();
    if (json.responseCode !== 101)
        throw new Error(json.responseMessage || "Failed to send reply");
    return json;
};

/* ── resolveGrievance kept for any legacy imports ──────────────────── */
export interface ResolvePayload {
    GrievanceId:    number;
    ResolutionNote: string;
    ResolvedBy:     string;
    ResponseId?:    number;
}
export const resolveGrievance = async (payload: ResolvePayload): Promise<ApiResponse> =>
    addAdminReply({
        GrievanceId:  payload.GrievanceId,
        ResponseId:   payload.ResponseId ?? 0,
        ReplyMessage: `RESOLUTION by ${payload.ResolvedBy}:\n\n${payload.ResolutionNote}`,
    }); 