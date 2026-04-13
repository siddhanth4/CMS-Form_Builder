export interface UpdateFormResponseApi {
    responseCode: number;
    responseStatus: boolean;
    responseErrorType: string;
    responseMessage: string;
    noOfRecord: number;
    data: {
        responseId: number;
    } | null;
}

export interface GetFormResponseApi {
    responseCode: number;
    responseStatus: boolean;
    responseErrorType: string;
    responseMessage: string;
    noOfRecord: number;
    data: any | null;
}

export interface UpdateFormResponsePayload {
    ResponseId: number | string;
    FormId: number | string;
    IPAddress: string;
    Status: "Y" | "N";
    FormResponse: any;
    MobileNo?: string;
    EmailId?: string;
}

export const updateFormResponseData = async (
    payload: UpdateFormResponsePayload
): Promise<UpdateFormResponseApi> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
    const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

    const adminCode = localStorage.getItem("ADCODE");
    if (!adminCode) throw new Error("Admin code not found. Please login again.");

    if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL");
    if (!apiKey) throw new Error("Missing VITE_API_KEY");

    const formData = new FormData();
    formData.append("ResponseId", String(payload.ResponseId));
    formData.append("FormId", String(payload.FormId));
    formData.append("IPAddress", payload.IPAddress ?? "");
    formData.append("Status", payload.Status ?? "Y");

    formData.append(
        "FormResponse",
        typeof payload.FormResponse === "string"
            ? payload.FormResponse
            : JSON.stringify(payload.FormResponse ?? {})
    );

    formData.append("MobileNo", payload.MobileNo ?? "");
    formData.append("EmailId", payload.EmailId ?? "");

    const response = await fetch(`${baseUrl}/api/Home/updateFormResponse`, {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "X-ADMIN-CODE": adminCode,
        },
        body: formData,
    });

    const json = (await response.json()) as UpdateFormResponseApi;

    if (!response.ok) {
        throw new Error(json?.responseMessage || `Request failed: ${response.status}`);
    }

    if (json.responseCode !== 101) {
        throw new Error(json.responseMessage || "Failed to update form response");
    }

    return json;
};

export const getFormResponseData = async (
    responseId: number,
    formId: number
): Promise<GetFormResponseApi> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
    const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

    const adminCode = localStorage.getItem("ADCODE");
    if (!adminCode) throw new Error("Admin code not found. Please login again.");

    if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL");
    if (!apiKey) throw new Error("Missing VITE_API_KEY");

    console.log("Making POST request with:", { responseId, formId });

    // Use FormData format as the API expects form data
    const formData = new FormData();
    formData.append("ResponseId", String(responseId));
    formData.append("FormId", String(formId));
    formData.append("FormResponse", JSON.stringify({})); // Add empty FormResponse to satisfy validation
    formData.append("Status", "Y"); // Add status field

    const response = await fetch(`${baseUrl}/api/Home/updateFormResponse`, {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "X-ADMIN-CODE": adminCode,
        },
        body: formData,
    });

    console.log("API Response status:", response.status);
    console.log("API Response headers:", response.headers);

    // Check if response has content before parsing JSON
    const responseText = await response.text();
    console.log("Raw API Response:", responseText);

    let json: GetFormResponseApi;
    try {
        json = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
    }

    console.log("Parsed API Response:", json);

    if (!response.ok) {
        throw new Error(json?.responseMessage || `Request failed: ${response.status} - ${responseText}`);
    }

    if (json.responseCode !== 101) {
        throw new Error(json.responseMessage || "Failed to fetch form response");
    }

    return json;
};