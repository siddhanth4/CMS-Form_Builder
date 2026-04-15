// import React, { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useProject } from "../Context/projectContext";
// import { PopupAlert } from "../Components/alert";
// import { addFormResponseData } from "../Api/addFormResponse";
// import { sendOtpMail } from "../Api/sendMailOtp";

// /* ================= TYPES ================= */
// type FieldType =
//     | "text"
//     | "email"
//     | "phone"
//     | "number"
//     | "dropdown"
//     | "radio"
//     | "checkbox"
//     | "date"
//     | "upload"
//     | "terms";

// type BuilderField = {
//     id: string;
//     type: FieldType;
//     label: string;
//     placeholder?: string;
//     required: boolean;
//     validation?: {
//         minLength?: number;
//         maxLength?: number;
//         errorMessage?: string;
//         pattern?: string;
//     }; description?: string;
//     descriptionAuto?: boolean;
//     options?: { id: string; label: string; value?: string }[];
//     numberConfig?: { min?: number; max?: number };
//     uploadConfig?: { accept?: string; multiple?: boolean; maxSizeMB?: number };
//     termsConfig?: { text?: string };
// };

// type Meta = {
//     title?: string;
//     subtitle?: string;
//     category?: string;
// };

// /* ================= VALIDATION HELPERS ================= */
// const isPasswordField = (f: BuilderField) => {
//     const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();
//     return text.includes("password") || text.includes("pass word") || text.includes("pwd");
// };

// const isPhoneField = (f: BuilderField) => {
//     const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();

//     // ✅ do not treat pincode as phone
//     if (
//         text.includes("pincode") ||
//         text.includes("pin code") ||
//         text.includes("postal code") ||
//         text.includes("zipcode") ||
//         text.includes("zip code")
//     ) {
//         return false;
//     }

//     return (
//         f.type === "phone" ||
//         text.includes("mobile") ||
//         text.includes("phone") ||
//         text.includes("contact")
//     );
// };

// const isEmailField = (f: BuilderField) => {
//     const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();
//     return f.type === "email" || text.includes("email") || text.includes("e-mail");
// };

// const isPincodeField = (f: BuilderField) => {
//     const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();
//     return (
//         text.includes("pincode") ||
//         text.includes("pin code") ||
//         text.includes("postal code") ||
//         text.includes("zipcode") ||
//         text.includes("zip code")
//     );
// };

// const getEmptyErrorMessage = (f: BuilderField) =>
//     f.validation?.errorMessage?.trim() || "This field is required.";

// const validateField = (f: BuilderField, value: any): string => {
//     const isEmpty =
//         value === null ||
//         value === undefined ||
//         (typeof value === "string" && value.trim() === "") ||
//         (Array.isArray(value) && value.length === 0) ||
//         (typeof value === "boolean" && value === false && f.type === "terms");

//     // required validation
//     if (f.required && isEmpty) {
//         return getEmptyErrorMessage(f);
//     }

//     // optional field empty => no further validation
//     if (isEmpty) return "";

//     // string value
//     const strValue = typeof value === "string" ? value.trim() : value;

//     // email format
//     if (isEmailField(f) && typeof strValue === "string" && strValue !== "") {
//         const regex = f.validation?.pattern
//             ? new RegExp(f.validation.pattern)
//             : /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!regex.test(strValue)) {
//             return f.validation?.errorMessage?.trim() || "Please enter a valid email address.";
//         }
//     }

//     // pincode validation
//     if (isPincodeField(f) && typeof strValue === "string" && strValue !== "") {
//         const onlyDigits = strValue.replace(/\D/g, "");
//         if (!/^\d{6}$/.test(onlyDigits)) {
//             return f.validation?.errorMessage?.trim() || "Please enter a valid 6-digit pincode.";
//         }
//         return "";
//     }

//     // mobile / phone validation
//     if (isPhoneField(f) && typeof strValue === "string" && strValue !== "") {
//         const onlyDigits = strValue.replace(/\D/g, "");
//         if (!/^\d{10}$/.test(onlyDigits)) {
//             return (
//                 f.validation?.errorMessage?.trim() ||
//                 "Please enter a valid 10-digit mobile number."
//             );
//         }
//         return "";
//     }

//     // password validation
//     if (isPasswordField(f) && typeof strValue === "string" && strValue !== "") {
//         const passwordRegex =
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+={}[\]:;"'<>,./\\|`~]).{8,}$/;

//         if (!passwordRegex.test(strValue)) {
//             return (
//                 f.validation?.errorMessage?.trim() ||
//                 "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
//             );
//         }
//         return "";
//     }

//     // number validation
//     if (f.type === "number" && strValue !== "") {
//         const n = Number(strValue);

//         if (Number.isNaN(n)) {
//             return f.validation?.errorMessage?.trim() || "Please enter a valid number.";
//         }

//         if (typeof f.numberConfig?.min === "number" && n < f.numberConfig.min) {
//             return (
//                 f.validation?.errorMessage?.trim() ||
//                 `Value must be at least ${f.numberConfig.min}.`
//             );
//         }

//         if (typeof f.numberConfig?.max === "number" && n > f.numberConfig.max) {
//             return (
//                 f.validation?.errorMessage?.trim() ||
//                 `Value must be at most ${f.numberConfig.max}.`
//             );
//         }

//         return "";
//     }

//     // generic min/max validation for text-like fields
//     if (typeof strValue === "string") {
//         const plainLength = strValue.length;

//         if (
//             typeof f.validation?.minLength === "number" &&
//             plainLength < f.validation.minLength
//         ) {
//             return (
//                 f.validation?.errorMessage?.trim() ||
//                 `Minimum ${f.validation.minLength} characters required.`
//             );
//         }

//         if (
//             typeof f.validation?.maxLength === "number" &&
//             plainLength > f.validation.maxLength
//         ) {
//             return (
//                 f.validation?.errorMessage?.trim() ||
//                 `Maximum ${f.validation.maxLength} characters allowed.`
//             );
//         }
//     }

//     return "";
// };

// /* ================= FIELD RENDER ================= */
// const renderField = (
//     f: BuilderField,
//     value: any,
//     setValue: (v: any) => void,
//     onBlur?: () => void,
//     error?: string
// ) => {
//     const controlClass = `form-control ${error ? "is-invalid" : ""}`;
//     const selectClass = `form-select ${error ? "is-invalid" : ""}`;

//     switch (f.type) {
//         case "dropdown":
//             return (
//                 <select
//                     className={selectClass}
//                     required={f.required}
//                     value={value ?? ""}
//                     onChange={(e) => setValue(e.target.value)}
//                     onBlur={onBlur}
//                 >
//                     <option value="">{f.placeholder || "Select..."}</option>
//                     {(f.options ?? []).map((o) => (
//                         <option key={o.id} value={o.value ?? o.label}>
//                             {o.label}
//                         </option>
//                     ))}
//                 </select>
//             );

//         case "radio":
//             return (
//                 <div className="mt-2">
//                     {(f.options ?? []).map((o) => {
//                         const v = o.value ?? o.label;
//                         return (
//                             <div key={o.id} className="form-check mb-2">
//                                 <input
//                                     className={`form-check-input ${error ? "is-invalid" : ""}`}
//                                     type="radio"
//                                     name={f.id}
//                                     value={v}
//                                     checked={value === v}
//                                     required={f.required}
//                                     onChange={(e) => setValue(e.target.value)}
//                                     onBlur={onBlur}
//                                 />
//                                 <label className="form-check-label">{o.label}</label>
//                             </div>
//                         );
//                     })}
//                 </div>
//             );

//         case "checkbox":
//             return (
//                 <div className="mt-2">
//                     {(f.options ?? []).map((o) => {
//                         const v = o.value ?? o.label;
//                         const arr: string[] = Array.isArray(value) ? value : [];
//                         const checked = arr.includes(v);

//                         return (
//                             <div key={o.id} className="form-check mb-2">
//                                 <input
//                                     className={`form-check-input ${error ? "is-invalid" : ""}`}
//                                     type="checkbox"
//                                     checked={checked}
//                                     onChange={(e) => {
//                                         if (e.target.checked) setValue([...arr, v]);
//                                         else setValue(arr.filter((x) => x !== v));
//                                     }}
//                                     onBlur={onBlur}
//                                 />
//                                 <label className="form-check-label">{o.label}</label>
//                             </div>
//                         );
//                     })}
//                 </div>
//             );

//         case "number":
//             return (
//                 <input
//                     className={controlClass}
//                     type="number"
//                     placeholder={f.placeholder || ""}
//                     min={f.numberConfig?.min}
//                     max={f.numberConfig?.max}
//                     required={f.required}
//                     value={value ?? ""}
//                     onChange={(e) => setValue(e.target.value)}
//                     onBlur={onBlur}
//                 />
//             );

//         case "email":
//             return (
//                 <input
//                     className={controlClass}
//                     type="email"
//                     placeholder={f.placeholder || ""}
//                     required={f.required}
//                     minLength={f.validation?.minLength}
//                     maxLength={f.validation?.maxLength}
//                     value={value ?? ""}
//                     onChange={(e) => setValue(e.target.value)}
//                     onBlur={onBlur}
//                 />
//             );

//         case "phone":
//             return (
//                 <input
//                     className={controlClass}
//                     type="text"
//                     inputMode="numeric"
//                     placeholder={f.placeholder || ""}
//                     required={f.required}
//                     minLength={f.validation?.minLength}
//                     maxLength={f.validation?.maxLength}
//                     value={value ?? ""}
//                     onChange={(e) => {
//                         const onlyDigits = e.target.value.replace(/\D/g, "");
//                         const maxLen = typeof f.validation?.maxLength === "number" ? f.validation.maxLength : undefined;
//                         setValue(maxLen ? onlyDigits.slice(0, maxLen) : onlyDigits);
//                     }}
//                     onBlur={onBlur}
//                 />
//             );

//         case "date":
//             return (
//                 <input
//                     className={controlClass}
//                     type="date"
//                     required={f.required}
//                     value={value ?? ""}
//                     onChange={(e) => setValue(e.target.value)}
//                     onBlur={onBlur}
//                 />
//             );

//         case "upload":
//             return (
//                 <input
//                     className={controlClass}
//                     type="file"
//                     accept={f.uploadConfig?.accept}
//                     multiple={!!f.uploadConfig?.multiple}
//                     required={f.required}
//                     onChange={(e) => {
//                         const files = (e.target as HTMLInputElement).files;
//                         if (!files) return setValue(null);
//                         if (f.uploadConfig?.multiple) setValue(Array.from(files));
//                         else setValue(files[0] ?? null);
//                     }}
//                     onBlur={onBlur}
//                 />
//             );

//         case "terms":
//             return (
//                 <label className="d-flex align-items-start gap-2">
//                     <input
//                         type="checkbox"
//                         required={f.required}
//                         checked={!!value}
//                         onChange={(e) => setValue(e.target.checked)}
//                         onBlur={onBlur}
//                     />
//                     <span>{f.termsConfig?.text ?? "I agree to the terms"}</span>
//                 </label>
//             );

//         default:
//             return (
//                 <input
//                     className={controlClass}
//                     type={isPasswordField(f) ? "password" : "text"}
//                     placeholder={f.placeholder || ""}
//                     required={f.required}
//                     minLength={f.validation?.minLength}
//                     maxLength={f.validation?.maxLength}
//                     value={value ?? ""}
//                     onChange={(e) => setValue(e.target.value)}
//                     onBlur={onBlur}
//                 />
//             );
//     }
// };

// const PublicFormView: React.FC = () => {
//     const [searchParams] = useSearchParams();
//     const formId = Number(searchParams.get("form"));

//     const {
//         selectedForm,
//         selectedFormLoading,
//         selectedFormError,
//         fetchFormById,
//         publicIP,
//         refreshIP,
//     } = useProject();

//     const [values, setValues] = useState<Record<string, any>>({});
//     const [submitted, setSubmitted] = useState(false);

//     // live validation states
//     const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
//     const [touched, setTouched] = useState<Record<string, boolean>>({});

//     // alerts
//     const [confirmOpen, setConfirmOpen] = useState(false);
//     const [successOpen, setSuccessOpen] = useState(false);
//     const [dangerOpen, setDangerOpen] = useState(false);
//     const [dangerMsg, setDangerMsg] = useState("Something went wrong!");

//     // consent + otp
//     const [consentTruth, setConsentTruth] = useState(false);
//     const [consentDpdp, setConsentDpdp] = useState(false);

//     const [otpServer, setOtpServer] = useState<string>("");
//     const [otpInput, setOtpInput] = useState<string>("");
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpSending, setOtpSending] = useState(false);
//     const year = useMemo(() => new Date().getFullYear(), []);

//     useEffect(() => {
//         if (!formId || Number.isNaN(formId)) return;
//         fetchFormById(formId);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [formId]);

//     useEffect(() => {
//         if (!publicIP) refreshIP();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [publicIP]);

//     const fields: BuilderField[] = selectedForm?.FormData?.fields ?? [];
//     const meta: Meta = selectedForm?.FormData?.meta ?? {};

//     // init values when schema loaded
//     useEffect(() => {
//         if (!fields.length) return;

//         const init: Record<string, any> = {};
//         for (const f of fields) {
//             if (f.type === "checkbox") init[f.id] = [];
//             else if (f.type === "terms") init[f.id] = false;
//             else init[f.id] = "";
//         }

//         setValues(init);
//         setSubmitted(false);
//         setFieldErrors({});
//         setTouched({});
//     }, [selectedForm?.FormData, fields.length]);

//     const validateAllFields = () => {
//         const errs: Record<string, string> = {};
//         for (const f of fields) {
//             const msg = validateField(f, values[f.id]);
//             if (msg) errs[f.id] = msg;
//         }
//         return errs;
//     };

//     const handleFieldChange = (f: BuilderField, v: any) => {
//         setValues((prev) => ({ ...prev, [f.id]: v }));

//         const msg = validateField(f, v);
//         setFieldErrors((prev) => ({
//             ...prev,
//             [f.id]: msg,
//         }));

//         setTouched((prev) => ({
//             ...prev,
//             [f.id]: true,
//         }));
//     };

//     const handleFieldBlur = (f: BuilderField) => {
//         const msg = validateField(f, values[f.id]);
//         setFieldErrors((prev) => ({
//             ...prev,
//             [f.id]: msg,
//         }));
//         setTouched((prev) => ({
//             ...prev,
//             [f.id]: true,
//         }));
//     };

//     const clearForm = () => {
//         const reset: Record<string, any> = {};
//         for (const f of fields) {
//             if (f.type === "checkbox") reset[f.id] = [];
//             else if (f.type === "terms") reset[f.id] = false;
//             else reset[f.id] = "";
//         }

//         setValues(reset);
//         setSubmitted(false);
//         setFieldErrors({});
//         setTouched({});

//         setConsentTruth(false);
//         setConsentDpdp(false);
//         setOtpServer("");
//         setOtpInput("");
//         setOtpSent(false);
//     };

//     // pick email & mobile from dynamic fields
//     const extractEmailMobile = () => {
//         let email = "";
//         let mobile = "";

//         for (const f of fields) {
//             const v = values[f.id];

//             if (!email && (f.type === "email" || /email/i.test(f.id) || /email/i.test(f.label))) {
//                 if (typeof v === "string") email = v.trim();
//             }

//             if (
//                 !mobile &&
//                 (f.type === "phone" ||
//                     /mobile/i.test(f.id) ||
//                     /phone/i.test(f.id) ||
//                     /mobile/i.test(f.label) ||
//                     /phone/i.test(f.label))
//             ) {
//                 if (typeof v === "string") mobile = v.trim();
//             }
//         }

//         return { email, mobile };
//     };

//     const generateOtp6 = async () => {
//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         setOtpServer(otp);
//         setOtpSent(true);
//         setOtpInput("");

//         console.log("LATEST_OTP:", otp);

//         try {
//             const { email } = extractEmailMobile();

//             if (!email) {
//                 setDangerMsg("Email not found. OTP generated, but email is empty.");
//                 setDangerOpen(true);
//                 return;
//             }

//             setOtpSending(true);

//             await sendOtpMail({
//                 ToEmail: email,
//                 OTP: otp,
//                 ExpiryMinutes: 5,
//             });
//         } catch (err: any) {
//             setDangerMsg(err?.message || "OTP generated, but email sending failed");
//             setDangerOpen(true);
//         } finally {
//             setOtpSending(false);
//         }
//     };

//     const otpOk =
//         otpServer.length === 6 &&
//         otpInput.trim().length === 6 &&
//         otpInput.trim() === otpServer;

//     const canSubmit = consentTruth && consentDpdp && otpOk;

//     useEffect(() => {
//         if (otpServer) console.log("OTP_STATE_UPDATED:", otpServer);
//     }, [otpServer]);

//     const onSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setSubmitted(true);

//         const errs = validateAllFields();
//         setFieldErrors(errs);

//         const allTouched: Record<string, boolean> = {};
//         for (const f of fields) allTouched[f.id] = true;
//         setTouched(allTouched);

//         if (Object.keys(errs).length > 0) return;

//         setConfirmOpen(true);
//     };

//     const normalizeFieldValue = (f: BuilderField, value: any) => {
//         if (f.type === "upload") {
//             if (Array.isArray(value)) {
//                 return value.map((file: File) => ({
//                     name: file.name,
//                     size: file.size,
//                     type: file.type,
//                 }));
//             }

//             if (value instanceof File) {
//                 return {
//                     name: value.name,
//                     size: value.size,
//                     type: value.type,
//                 };
//             }

//             return null;
//         }

//         return value;
//     };

//     const buildFormResponsePayload = () => ({
//         id: selectedForm?.FormData?.id || `form_${formId}`,
//         meta,
//         fields: fields.map((f) => ({
//             ...f,
//             value: normalizeFieldValue(
//                 f,
//                 values[f.id] ?? (f.type === "checkbox" ? [] : f.type === "terms" ? false : "")
//             ),
//         })),
//         createdAt: selectedForm?.FormData?.createdAt || new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         submittedAt: new Date().toISOString(),
//     });

//     const onConfirmSubmit = async () => {
//         try {
//             const { email, mobile } = extractEmailMobile();

//             const responsePayload = buildFormResponsePayload();

//             const res = await addFormResponseData({
//                 FormId: formId,
//                 IPAddress: publicIP || "0.0.0.0",
//                 Status: "Y",
//                 FormResponse: responsePayload,
//                 MobileNo: mobile,
//                 EmailId: email,
//             });

//             if (res?.responseCode !== 101) {
//                 throw new Error(res?.responseMessage || "Failed to submit");
//             }

//             setConfirmOpen(false);
//             setSuccessOpen(true);
//             clearForm();
//         } catch (err: any) {
//             setConfirmOpen(false);
//             setDangerMsg(err?.message || "Failed to submit form");
//             setDangerOpen(true);
//         }
//     };

//     /* ================= UI STATES ================= */
//     if (!formId || Number.isNaN(formId)) {
//         return (
//             <div className="container py-5">
//                 <div className="alert alert-danger mb-0">Invalid form link.</div>
//             </div>
//         );
//     }

//     if (selectedFormLoading) {
//         return (
//             <div className="container py-5">
//                 <div className="text-secondary">Loading form...</div>
//             </div>
//         );
//     }

//     if (selectedFormError) {
//         return (
//             <div className="container py-5">
//                 <div className="alert alert-danger mb-0">{selectedFormError}</div>
//             </div>
//         );
//     }

//     if (!selectedForm?.FormData || !fields.length) {
//         return (
//             <div className="container py-5">
//                 <div className="text-secondary">Form not found / no fields.</div>
//             </div>
//         );
//     }

//     const getFieldDescription = (f: BuilderField) => {
//         return (f.description ?? "").trim();
//     };

//     /* ================= RENDER ================= */
//     return (
//         <>
//             <div className="shell">
//                 {/* Topbar */}
//                 <div className="topbar mb-2 d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                         <div className="brand-badge">FF</div>
//                         <div className="lh-sm">
//                             <div className="fw-bold" style={{ fontSize: ".98rem" }}>
//                                 NJ Softtech
//                             </div>
//                             <div className="text-secondary" style={{ fontSize: ".78rem" }}>
//                                 Secure Form
//                             </div>
//                         </div>
//                     </div>

//                     <span className="help-chip d-none d-md-inline">
//                         <i className="bi bi-shield-lock" /> Encrypted
//                     </span>
//                 </div>

//                 {/* Hero */}
//                 <div className="hero mb-2">
//                     <div className="row g-2 align-items-center">
//                         <div className="col-12 col-md-8">
//                             <div className="text-secondary small fw-semibold text-uppercase">
//                                 {meta.category ?? "Registration"}
//                             </div>
//                             <div className="h4 fw-bold mb-1">{meta.title ?? "Public Form"}</div>
//                             {!!meta.subtitle && (
//                                 <div className="text-secondary small mb-1">{meta.subtitle}</div>
//                             )}
//                             <div className="text-secondary small">
//                                 Fields marked with <span className="req">*</span> are required.
//                             </div>
//                         </div>

//                         <div className="col-12 col-md-4">
//                             <div className="d-flex flex-wrap gap-2 justify-content-md-end">
//                                 <span className="help-chip">
//                                     <i className="bi bi-clock" /> ~2 min
//                                 </span>
//                                 <span className="help-chip">
//                                     <i className="bi bi-envelope" /> Confirm
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Form card */}
//                 <div className="form-card card">
//                     <div className="card-header">
//                         <div className="d-flex align-items-start justify-content-between gap-2">
//                             <div>
//                                 <div className="fw-bold">{meta.title ?? "Form"}</div>
//                                 <div className="text-secondary" style={{ fontSize: ".8rem" }}>
//                                     Powered by NJ Softtech
//                                 </div>
//                             </div>
//                             <span className="badge rounded-pill text-bg-secondary">Public</span>
//                         </div>
//                     </div>

//                     <div className="card-body">
//                         <form noValidate onSubmit={onSubmit}>
//                             <div className="row g-3">
//                                 {fields.map((f) => {
//                                     const err = fieldErrors[f.id] || "";
//                                     const showErr = !!err && (submitted || touched[f.id]);
//                                     const desc = getFieldDescription(f);

//                                     return (
//                                         <div key={f.id} className="col-12">
//                                             <div className="row g-2 align-items-start">
//                                                 {/* LEFT SIDE: Label + Input */}
//                                                 <div className="col-12 col-md-6">
//                                                     <label className="form-label fw-semibold">
//                                                         {f.label} {f.required && <span className="req">*</span>}
//                                                     </label>

//                                                     {renderField(
//                                                         f,
//                                                         values[f.id],
//                                                         (v) => handleFieldChange(f, v),
//                                                         () => handleFieldBlur(f),
//                                                         showErr ? err : ""
//                                                     )}

//                                                     {showErr && (
//                                                         <div className="form-text text-danger">
//                                                             {err}
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* RIGHT SIDE: Description */}
//                                                 <div className="col-12 col-md-6">
//                                                     {!!desc && (
//                                                         <div
//                                                             className="small"
//                                                             style={{
//                                                                 color: "#ff6666",
//                                                                 lineHeight: 1.4,
//                                                                 paddingTop: 30,
//                                                                 whiteSpace: "pre-wrap",
//                                                             }}
//                                                         >
//                                                             {desc}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}

//                                 {/* CONSENT + OTP BLOCK */}
//                                 <div className="col-12 Declaration-block">
//                                     <div className="d-flex flex-column gap-2">
//                                         <label className="form-check d-flex align-items-start gap-2 mb-0">
//                                             <input
//                                                 className="form-check-input mt-1"
//                                                 type="checkbox"
//                                                 checked={consentTruth}
//                                                 onChange={(e) => setConsentTruth(e.target.checked)}
//                                             />
//                                             <span className="small">
//                                                 I am aware that it is my duty to submit truthful information.
//                                             </span>
//                                         </label>

//                                         <label className="form-check d-flex align-items-start gap-2 mb-0">
//                                             <input
//                                                 className="form-check-input mt-1"
//                                                 type="checkbox"
//                                                 checked={consentDpdp}
//                                                 onChange={(e) => setConsentDpdp(e.target.checked)}
//                                             />
//                                             <span className="small">
//                                                 I hereby provide my free, specific, informed, and unambiguous consent to the
//                                                 Data Fiduciary for the processing, retention, and use of my personal data in
//                                                 accordance with the applicable provisions section 6 of the Digital Personal
//                                                 Data Protection Act, 2023.
//                                             </span>
//                                         </label>

//                                         <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
//                                             <div className="small fw-semibold white-text">Email / sms / Whatsapp OTP</div>

//                                             <div className="position-relative white-text" style={{ maxWidth: 220, width: "100%" }}>
//                                                 <input
//                                                     className={`form-control pe-5 ${otpInput.trim().length === 6
//                                                         ? otpOk
//                                                             ? "is-valid"
//                                                             : "is-invalid"
//                                                         : ""
//                                                         }`}
//                                                     placeholder="Enter OTP"
//                                                     value={otpInput}
//                                                     maxLength={6}
//                                                     inputMode="numeric"
//                                                     pattern="[0-9]*"
//                                                     onChange={(e) => {
//                                                         const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 6);
//                                                         setOtpInput(onlyDigits);
//                                                     }}
//                                                 />

//                                                 {otpInput.trim().length === 6 && (
//                                                     <span
//                                                         className="position-absolute top-50 translate-middle-y"
//                                                         style={{ right: 10 }}
//                                                     >
//                                                         {otpOk ? (
//                                                             <i className="bi bi-check-circle-fill right-icon" />
//                                                         ) : (
//                                                             <i className="bi bi-x-circle-fill wrong-icon" />
//                                                         )}
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             <div className="small white-text">for my consent.</div>
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-secondary btn-sm OTPButton"
//                                                 onClick={generateOtp6}
//                                                 disabled={otpSending}
//                                             >
//                                                 {otpSending ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-12 d-flex flex-wrap gap-2 align-items-center justify-content-between pt-1">
//                                     <div className="footer-note d-none d-md-block">
//                                         <i className="bi bi-info-circle" /> Review before submit
//                                     </div>

//                                     <div className="d-flex gap-2 ms-auto">
//                                         <button
//                                             type="button"
//                                             className="btn btn-outline-secondary btn-sm ClearButton"
//                                             style={{ borderRadius: 12 }}
//                                             onClick={clearForm}
//                                         >
//                                             Clear
//                                         </button>

//                                         <button
//                                             type="submit"
//                                             className="btn btn-brand btn-sm px-3 SubmitButton"
//                                             disabled={!canSubmit}
//                                             title={!canSubmit ? "Please accept consent and verify OTP to submit" : ""}
//                                         >
//                                             <i className="bi bi-send me-1" />
//                                             Submit
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 <div className="footer-note text-center mt-3">
//                     © {year} NJ Softtech • DPDP
//                 </div>
//             </div>

//             {/* CONFIRM POPUP */}
//             <PopupAlert
//                 open={confirmOpen}
//                 type="warning"
//                 title="Confirm Submission"
//                 message="Are you sure you want to submit this form?"
//                 confirmMode
//                 confirmText="Yes, Submit"
//                 cancelText="No"
//                 onClose={() => setConfirmOpen(false)}
//                 onConfirm={onConfirmSubmit}
//                 onCancel={() => setConfirmOpen(false)}
//             />

//             {/* SUCCESS POPUP */}
//             <PopupAlert
//                 open={successOpen}
//                 type="success"
//                 title="Submitted!"
//                 message="Your response was saved successfully."
//                 onClose={() => setSuccessOpen(false)}
//                 autoCloseMs={2000}
//             />

//             {/* ERROR POPUP */}
//             <PopupAlert
//                 open={dangerOpen}
//                 type="danger"
//                 title="Error"
//                 message={dangerMsg}
//                 onClose={() => setDangerOpen(false)}
//                 autoCloseMs={2500}
//             />
//         </>
//     );
// };

// export default PublicFormView;

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProject } from "../Context/projectContext";
import { PopupAlert } from "../Components/alert";
import { addFormResponseData } from "../Api/addFormResponse";
import { sendOtpMail } from "../Api/sendMailOtp";
import { getNoticeById } from "../Api/noticeApi"; 

/* ================= TYPES ================= */
type FieldType =
    | "text"
    | "email"
    | "phone"
    | "number"
    | "dropdown"
    | "radio"
    | "checkbox"
    | "date"
    | "upload"
    | "terms";

type BuilderField = {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: {
        minLength?: number;
        maxLength?: number;
        errorMessage?: string;
        pattern?: string;
    }; 
    description?: string;
    descriptionAuto?: boolean;
    options?: { id: string; label: string; value?: string }[];
    numberConfig?: { min?: number; max?: number };
    uploadConfig?: { accept?: string; multiple?: boolean; maxSizeMB?: number };
    termsConfig?: { text?: string };
};

type Meta = {
    title?: string;
    subtitle?: string;
    category?: string;
    noticeId?: string;
    NoticeId?: string;
};

/* ================= VALIDATION HELPERS ================= */
const isPasswordField = (f: BuilderField) => {
    const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();
    return text.includes("password") || text.includes("pass word") || text.includes("pwd");
};

const isPhoneField = (f: BuilderField) => {
    const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();

    if (
        text.includes("pincode") ||
        text.includes("pin code") ||
        text.includes("postal code") ||
        text.includes("zipcode") ||
        text.includes("zip code")
    ) {
        return false;
    }

    return (
        f.type === "phone" ||
        text.includes("mobile") ||
        text.includes("phone") ||
        text.includes("contact")
    );
};

const isEmailField = (f: BuilderField) => {
    const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();
    return f.type === "email" || text.includes("email") || text.includes("e-mail");
};

const isPincodeField = (f: BuilderField) => {
    const text = `${f.id} ${f.label} ${f.placeholder ?? ""}`.toLowerCase();
    return (
        text.includes("pincode") ||
        text.includes("pin code") ||
        text.includes("postal code") ||
        text.includes("zipcode") ||
        text.includes("zip code")
    );
};

const getEmptyErrorMessage = (f: BuilderField) =>
    f.validation?.errorMessage?.trim() || "This field is required.";

const validateField = (f: BuilderField, value: any): string => {
    const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "boolean" && value === false && f.type === "terms");

    if (f.required && isEmpty) {
        return getEmptyErrorMessage(f);
    }

    if (isEmpty) return "";

    const strValue = typeof value === "string" ? value.trim() : value;

    if (isEmailField(f) && typeof strValue === "string" && strValue !== "") {
        const regex = f.validation?.pattern
            ? new RegExp(f.validation.pattern)
            : /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(strValue)) {
            return f.validation?.errorMessage?.trim() || "Please enter a valid email address.";
        }
    }

    if (isPincodeField(f) && typeof strValue === "string" && strValue !== "") {
        const onlyDigits = strValue.replace(/\D/g, "");
        if (!/^\d{6}$/.test(onlyDigits)) {
            return f.validation?.errorMessage?.trim() || "Please enter a valid 6-digit pincode.";
        }
        return "";
    }

    if (isPhoneField(f) && typeof strValue === "string" && strValue !== "") {
        const onlyDigits = strValue.replace(/\D/g, "");
        if (!/^\d{10}$/.test(onlyDigits)) {
            return (
                f.validation?.errorMessage?.trim() ||
                "Please enter a valid 10-digit mobile number."
            );
        }
        return "";
    }

    if (isPasswordField(f) && typeof strValue === "string" && strValue !== "") {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+={}[\]:;"'<>,./\\|`~]).{8,}$/;

        if (!passwordRegex.test(strValue)) {
            return (
                f.validation?.errorMessage?.trim() ||
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            );
        }
        return "";
    }

    if (f.type === "number" && strValue !== "") {
        const n = Number(strValue);

        if (Number.isNaN(n)) {
            return f.validation?.errorMessage?.trim() || "Please enter a valid number.";
        }

        if (typeof f.numberConfig?.min === "number" && n < f.numberConfig.min) {
            return (
                f.validation?.errorMessage?.trim() ||
                `Value must be at least ${f.numberConfig.min}.`
            );
        }

        if (typeof f.numberConfig?.max === "number" && n > f.numberConfig.max) {
            return (
                f.validation?.errorMessage?.trim() ||
                `Value must be at most ${f.numberConfig.max}.`
            );
        }

        return "";
    }

    if (typeof strValue === "string") {
        const plainLength = strValue.length;

        if (
            typeof f.validation?.minLength === "number" &&
            plainLength < f.validation.minLength
        ) {
            return (
                f.validation?.errorMessage?.trim() ||
                `Minimum ${f.validation.minLength} characters required.`
            );
        }

        if (
            typeof f.validation?.maxLength === "number" &&
            plainLength > f.validation.maxLength
        ) {
            return (
                f.validation?.errorMessage?.trim() ||
                `Maximum ${f.validation.maxLength} characters allowed.`
            );
        }
    }

    return "";
};

/* ================= FIELD RENDER ================= */
const renderField = (
    f: BuilderField,
    value: any,
    setValue: (v: any) => void,
    onBlur?: () => void,
    error?: string
) => {
    const controlClass = `form-control ${error ? "is-invalid" : ""}`;
    const selectClass = `form-select ${error ? "is-invalid" : ""}`;

    // Overriding background to fit dark theme if Bootstrap fails
    const darkStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8f9fa" };

    switch (f.type) {
        case "dropdown":
            return (
                <select
                    className={selectClass}
                    required={f.required}
                    value={value ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    style={darkStyle}
                >
                    <option value="" style={{ color: "#000" }}>{f.placeholder || "Select..."}</option>
                    {(f.options ?? []).map((o) => (
                        <option key={o.id} value={o.value ?? o.label} style={{ color: "#000" }}>
                            {o.label}
                        </option>
                    ))}
                </select>
            );

        case "radio":
            return (
                <div className="mt-2">
                    {(f.options ?? []).map((o) => {
                        const v = o.value ?? o.label;
                        return (
                            <div key={o.id} className="form-check mb-2">
                                <input
                                    className={`form-check-input ${error ? "is-invalid" : ""}`}
                                    type="radio"
                                    name={f.id}
                                    value={v}
                                    checked={value === v}
                                    required={f.required}
                                    onChange={(e) => setValue(e.target.value)}
                                    onBlur={onBlur}
                                />
                                <label className="form-check-label text-light">{o.label}</label>
                            </div>
                        );
                    })}
                </div>
            );

        case "checkbox":
            return (
                <div className="mt-2">
                    {(f.options ?? []).map((o) => {
                        const v = o.value ?? o.label;
                        const arr: string[] = Array.isArray(value) ? value : [];
                        const checked = arr.includes(v);

                        return (
                            <div key={o.id} className="form-check mb-2">
                                <input
                                    className={`form-check-input ${error ? "is-invalid" : ""}`}
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                        if (e.target.checked) setValue([...arr, v]);
                                        else setValue(arr.filter((x) => x !== v));
                                    }}
                                    onBlur={onBlur}
                                />
                                <label className="form-check-label text-light">{o.label}</label>
                            </div>
                        );
                    })}
                </div>
            );

        case "number":
            return (
                <input
                    className={controlClass}
                    type="number"
                    placeholder={f.placeholder || ""}
                    min={f.numberConfig?.min}
                    max={f.numberConfig?.max}
                    required={f.required}
                    value={value ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    style={darkStyle}
                />
            );

        case "email":
            return (
                <input
                    className={controlClass}
                    type="email"
                    placeholder={f.placeholder || ""}
                    required={f.required}
                    minLength={f.validation?.minLength}
                    maxLength={f.validation?.maxLength}
                    value={value ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    style={darkStyle}
                />
            );

        case "phone":
            return (
                <input
                    className={controlClass}
                    type="text"
                    inputMode="numeric"
                    placeholder={f.placeholder || ""}
                    required={f.required}
                    minLength={f.validation?.minLength}
                    maxLength={f.validation?.maxLength}
                    value={value ?? ""}
                    onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        const maxLen = typeof f.validation?.maxLength === "number" ? f.validation.maxLength : undefined;
                        setValue(maxLen ? onlyDigits.slice(0, maxLen) : onlyDigits);
                    }}
                    onBlur={onBlur}
                    style={darkStyle}
                />
            );

        case "date":
            return (
                <input
                    className={controlClass}
                    type="date"
                    required={f.required}
                    value={value ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    style={darkStyle}
                />
            );

        case "upload":
            return (
                <input
                    className={controlClass}
                    type="file"
                    accept={f.uploadConfig?.accept}
                    multiple={!!f.uploadConfig?.multiple}
                    required={f.required}
                    onChange={(e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (!files) return setValue(null);
                        if (f.uploadConfig?.multiple) setValue(Array.from(files));
                        else setValue(files[0] ?? null);
                    }}
                    onBlur={onBlur}
                    style={darkStyle}
                />
            );

        case "terms":
            return (
                <label className="d-flex align-items-start gap-2 text-light">
                    <input
                        type="checkbox"
                        required={f.required}
                        checked={!!value}
                        onChange={(e) => setValue(e.target.checked)}
                        onBlur={onBlur}
                        className="mt-1"
                    />
                    <span>{f.termsConfig?.text ?? "I agree to the terms"}</span>
                </label>
            );

        default:
            return (
                <input
                    className={controlClass}
                    type={isPasswordField(f) ? "password" : "text"}
                    placeholder={f.placeholder || ""}
                    required={f.required}
                    minLength={f.validation?.minLength}
                    maxLength={f.validation?.maxLength}
                    value={value ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    style={darkStyle}
                />
            );
    }
};

const PublicFormView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const formId = Number(searchParams.get("form"));

    const {
        selectedForm,
        selectedFormLoading,
        selectedFormError,
        fetchFormById,
        publicIP,
        refreshIP,
    } = useProject();

    const [values, setValues] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);

    // live validation states
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // alerts
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [dangerOpen, setDangerOpen] = useState(false);
    const [dangerMsg, setDangerMsg] = useState("Something went wrong!");

    // consent + otp
    const [consentTruth, setConsentTruth] = useState(false);
    const [consentDpdp, setConsentDpdp] = useState(false);

    const [otpServer, setOtpServer] = useState<string>("");
    const [otpInput, setOtpInput] = useState<string>("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const year = useMemo(() => new Date().getFullYear(), []);

    // 👉 Notice states
    const [noticeHtml, setNoticeHtml] = useState<string>("");
    const [noticeLoading, setNoticeLoading] = useState<boolean>(true);
    const [hasAgreed, setHasAgreed] = useState<boolean>(false);

    useEffect(() => {
        if (!formId || Number.isNaN(formId)) return;
        fetchFormById(formId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    useEffect(() => {
        if (!publicIP) refreshIP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicIP]);

    // 👉 BULLETPROOF BACKEND EXTRACTION
    let formObject = selectedForm?.FormData || selectedForm?.formData || selectedForm?.data || selectedForm || {};
    
    if (typeof formObject === 'string') {
        try {
            formObject = JSON.parse(formObject);
        } catch (e) {
            formObject = {};
        }
    }

    const rawMeta = formObject.meta || formObject.Meta || {};
    const fields: BuilderField[] = formObject.fields || formObject.Fields || [];
    
    const activeNoticeId = rawMeta.noticeId || rawMeta.NoticeId || formObject?.noticeId || formObject?.NoticeId || null;

    // 👉 GATEWAY CHECK
    useEffect(() => {
        if (selectedFormLoading) return; 
        
        if (!formObject || Object.keys(formObject).length === 0) {
            setNoticeLoading(false);
            return;
        }

        if (activeNoticeId && !hasAgreed) {
            setNoticeLoading(true);
            getNoticeById(String(activeNoticeId))
                .then(res => {
                    let noticeData = res.data ?? res;
                    
                    if (typeof noticeData === 'string') {
                        try { noticeData = JSON.parse(noticeData); } catch (e) { }
                    }

                    if (Array.isArray(noticeData)) {
                        noticeData = noticeData.length > 0 ? noticeData[0] : {};
                    }

                    const html = noticeData?.Notice || noticeData?.notice || noticeData?.noticeContent;
                    
                    if (html) {
                        setNoticeHtml(html);
                    } else {
                        console.warn("Notice Data found, but missing HTML:", noticeData);
                        setNoticeHtml("<p class='text-center py-5'>Notice Content Unavailable.</p>");
                    }
                })
                .catch(err => {
                    console.error("Notice load error", err);
                    setNoticeHtml("<p class='text-center text-danger py-5'>Failed to load the Privacy Notice.</p>");
                })
                .finally(() => setNoticeLoading(false));
        } else if (!activeNoticeId && !hasAgreed) {
            setNoticeLoading(false);
            setHasAgreed(true); 
        }
    }, [activeNoticeId, hasAgreed, selectedFormLoading, formObject]);

    // init values when schema loaded
    useEffect(() => {
        if (!fields.length) return;

        const init: Record<string, any> = {};
        for (const f of fields) {
            if (f.type === "checkbox") init[f.id] = [];
            else if (f.type === "terms") init[f.id] = false;
            else init[f.id] = "";
        }

        setValues(init);
        setSubmitted(false);
        setFieldErrors({});
        setTouched({});
    }, [fields.length]);

    const validateAllFields = () => {
        const errs: Record<string, string> = {};
        for (const f of fields) {
            const msg = validateField(f, values[f.id]);
            if (msg) errs[f.id] = msg;
        }
        return errs;
    };

    const handleFieldChange = (f: BuilderField, v: any) => {
        setValues((prev) => ({ ...prev, [f.id]: v }));

        const msg = validateField(f, v);
        setFieldErrors((prev) => ({
            ...prev,
            [f.id]: msg,
        }));

        setTouched((prev) => ({
            ...prev,
            [f.id]: true,
        }));
    };

    const handleFieldBlur = (f: BuilderField) => {
        const msg = validateField(f, values[f.id]);
        setFieldErrors((prev) => ({
            ...prev,
            [f.id]: msg,
        }));
        setTouched((prev) => ({
            ...prev,
            [f.id]: true,
        }));
    };

    const clearForm = () => {
        const reset: Record<string, any> = {};
        for (const f of fields) {
            if (f.type === "checkbox") reset[f.id] = [];
            else if (f.type === "terms") reset[f.id] = false;
            else reset[f.id] = "";
        }

        setValues(reset);
        setSubmitted(false);
        setFieldErrors({});
        setTouched({});

        setConsentTruth(false);
        setConsentDpdp(false);
        setOtpServer("");
        setOtpInput("");
        setOtpSent(false);
    };

    const extractEmailMobile = () => {
        let email = "";
        let mobile = "";

        for (const f of fields) {
            const v = values[f.id];

            if (!email && (f.type === "email" || /email/i.test(f.id) || /email/i.test(f.label))) {
                if (typeof v === "string") email = v.trim();
            }

            if (
                !mobile &&
                (f.type === "phone" ||
                    /mobile/i.test(f.id) ||
                    /phone/i.test(f.id) ||
                    /mobile/i.test(f.label) ||
                    /phone/i.test(f.label))
            ) {
                if (typeof v === "string") mobile = v.trim();
            }
        }

        return { email, mobile };
    };

    const generateOtp6 = async () => {
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        setOtpServer(otp);
        setOtpSent(true);
        setOtpInput("");

        console.log("LATEST_OTP:", otp);

        try {
            const { email } = extractEmailMobile();

            if (!email) {
                setDangerMsg("Email not found. OTP generated, but email is empty.");
                setDangerOpen(true);
                return;
            }

            setOtpSending(true);

            await sendOtpMail({
                ToEmail: email,
                OTP: otp,
                ExpiryMinutes: 5,
            });
        } catch (err: any) {
            setDangerMsg(err?.message || "OTP generated, but email sending failed");
            setDangerOpen(true);
        } finally {
            setOtpSending(false);
        }
    };

    const otpOk =
        otpServer.length === 6 &&
        otpInput.trim().length === 6 &&
        otpInput.trim() === otpServer;

    const canSubmit = consentTruth && consentDpdp && otpOk;

    useEffect(() => {
        if (otpServer) console.log("OTP_STATE_UPDATED:", otpServer);
    }, [otpServer]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const errs = validateAllFields();
        setFieldErrors(errs);

        const allTouched: Record<string, boolean> = {};
        for (const f of fields) allTouched[f.id] = true;
        setTouched(allTouched);

        if (Object.keys(errs).length > 0) return;

        setConfirmOpen(true);
    };

    const normalizeFieldValue = (f: BuilderField, value: any) => {
        if (f.type === "upload") {
            if (Array.isArray(value)) {
                return value.map((file: File) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                }));
            }

            if (value instanceof File) {
                return {
                    name: value.name,
                    size: value.size,
                    type: value.type,
                };
            }

            return null;
        }

        return value;
    };

    const buildFormResponsePayload = () => ({
        id: formObject?.id || `form_${formId}`,
        meta: rawMeta,
        fields: fields.map((f) => ({
            ...f,
            value: normalizeFieldValue(
                f,
                values[f.id] ?? (f.type === "checkbox" ? [] : f.type === "terms" ? false : "")
            ),
        })),
        createdAt: formObject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
    });

    const onConfirmSubmit = async () => {
        try {
            const { email, mobile } = extractEmailMobile();

            const responsePayload = buildFormResponsePayload();

            const res = await addFormResponseData({
                FormId: formId,
                IPAddress: publicIP || "0.0.0.0",
                Status: "Y",
                FormResponse: responsePayload,
                MobileNo: mobile,
                EmailId: email,
            });

            if (res?.responseCode !== 101) {
                throw new Error(res?.responseMessage || "Failed to submit");
            }

            setConfirmOpen(false);
            setSuccessOpen(true);
            clearForm();
        } catch (err: any) {
            setConfirmOpen(false);
            setDangerMsg(err?.message || "Failed to submit form");
            setDangerOpen(true);
        }
    };

    /* ================= UI STATES ================= */
    if (!formId || Number.isNaN(formId)) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger mb-0">Invalid form link.</div>
            </div>
        );
    }

    if (selectedFormLoading) {
        return (
            <div className="container py-5">
                <div className="text-secondary"><div className="spinner-border spinner-border-sm me-2"></div> Loading form data...</div>
            </div>
        );
    }

    if (selectedFormError) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger mb-0">{selectedFormError}</div>
            </div>
        );
    }

    if (!formObject || Object.keys(formObject).length === 0 || !fields.length) {
        return (
            <div className="container py-5">
                <div className="text-secondary">Form not found / no fields.</div>
            </div>
        );
    }

    const getFieldDescription = (f: BuilderField) => {
        return (f.description ?? "").trim();
    };

    const formTitle = rawMeta.title || rawMeta.Title || "Public Form";
    const formCategory = rawMeta.category || rawMeta.Category || "Registration";
    const formSubtitle = rawMeta.subtitle || rawMeta.Subtitle || "";

    /* ================= RENDER INTERCEPT: Notice Preview ================= */
    if (activeNoticeId && !hasAgreed) {
        return (
            <div className="shell d-flex flex-column align-items-center justify-content-center min-vh-100 py-4" style={{ background: "#0b0c10" }}>
                {/* 👉 CSS Override to completely fix HTML inline styles */}
                <style>{`
                    .custom-notice-html {
                        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                        color: #cbd5e1 !important;
                        line-height: 1.6;
                    }
                    .custom-notice-html h2 {
                        color: #f8fafc !important;
                        font-size: 1.5rem;
                        font-weight: 600;
                        border-bottom: 1px solid rgba(255,255,255,0.08) !important;
                        padding-bottom: 16px;
                        margin-bottom: 24px;
                    }
                    .custom-notice-html p {
                        color: #94a3b8 !important;
                        font-size: 0.95rem;
                    }
                    .custom-notice-html h4 {
                        color: #7c9ff7 !important; /* Replaced neon blue with elegant soft brand blue */
                        font-size: 1.1rem;
                        font-weight: 600;
                        margin-top: 32px !important;
                        margin-bottom: 16px !important;
                    }
                    .custom-notice-html strong {
                        color: #f1f5f9 !important;
                        font-weight: 600;
                    }
                    .custom-notice-html ul, .custom-notice-html div[style*="white-space: pre-wrap"] {
                        background: rgba(255, 255, 255, 0.02) !important;
                        border: 1px solid rgba(255, 255, 255, 0.05) !important;
                        border-radius: 10px !important;
                        padding: 16px 20px !important;
                        color: #cbd5e1 !important;
                        font-size: 0.95rem;
                    }
                    .custom-notice-html ul {
                        padding-left: 36px !important;
                    }
                    .custom-notice-html li {
                        margin-bottom: 8px;
                    }
                    .custom-notice-html li:last-child {
                        margin-bottom: 0;
                    }
                    /* Scrollbar styling for the box */
                    .custom-notice-html::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-notice-html::-webkit-scrollbar-track {
                        background: transparent; 
                    }
                    .custom-notice-html::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.1); 
                        border-radius: 4px;
                    }
                    .custom-notice-html::-webkit-scrollbar-thumb:hover {
                        background: rgba(255,255,255,0.2); 
                    }
                `}</style>
                <div style={{ width: "100%", padding: "0" }}>
                    
                    {/* Topbar / Branding */}
                    <div className="d-flex align-items-center gap-3 mb-4 justify-content-center">
                        <div className="brand-badge d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: "1.2rem", background: "#4f6ef7", color: "#fff", borderRadius: "12px", fontWeight: "bold" }}>FF</div>
                        <div className="lh-sm text-start">
                            <div className="fw-bold fs-5 text-white">NJ Softtech</div>
                            <div className="small fw-semibold" style={{ letterSpacing: "0.5px", color: "#7c9ff7" }}>
                                Secure Privacy Gateway
                            </div>
                        </div>
                    </div>

                    {/* Main Gateway Card */}
                    <div className="card shadow-lg border-0" style={{ background: "#11131a", borderRadius: "16px", overflow: "hidden" }}>
                        <div className="card-header p-3 p-md-3.5 pb-0 border-0 bg-transparent">
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(79,110,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <i className="bi bi-shield-check fs-4" style={{ color: "#7c9ff7" }}></i>
                                </div>
                                <div >
                                    <h4 className="mb-1 fw-bold text-white">Data Privacy Notice</h4>
                                    <p className="mb-0" style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                                        Please review and acknowledge our data processing policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-4 pt-4">
                            {noticeLoading ? (
                                <div className="text-center py-5 my-4">
                                    
                                    <div className="spinner-border mb-3" style={{ width: "2rem", height: "2rem", color: "#4f6ef7" }}></div>
                                    <h6 className="fw-semibold text-white">Loading Notice...</h6>
                                    <div className="small" style={{ color: "#94a3b8" }}>Retrieving secure document</div>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className="custom-notice-html mb-4"
                                        style={{
                                            maxHeight: "100vh",
                                            // maxWidth: "100vh",
                                            overflowY: "auto",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            background: "#08090c", 
                                            boxShadow: "inset 0px 2px 12px rgba(0,0,0,0.3)"
                                        }}
                                        dangerouslySetInnerHTML={{ __html: noticeHtml || "<p class='text-center py-4'>Notice Content Unavailable</p>" }}
                                    />
                                    
                                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pt-4 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="small mb-3 mb-md-0 d-flex align-items-center" style={{ color: "#94a3b8" }}>
                                            <i className="bi bi-info-circle-fill me-2" style={{ color: "#7c9ff7" }}></i>
                                            <span>Required under <strong className="text-white">DPDP Act, 2023</strong></span>
                                        </div>
                                        <button
                                            className="btn px-4 py-2 fw-bold w-100 w-md-auto d-flex align-items-center justify-content-center gap-2"
                                            style={{ background: "#4f6ef7", color: "#fff", border: "none", borderRadius: "8px", transition: "all 0.2s" }}
                                            onClick={() => setHasAgreed(true)}
                                        >
                                            I Agree & Continue <i className="bi bi-arrow-right" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ================= RENDER MAIN FORM ================= */
    return (
        <>
            <div className="shell d-flex flex-column align-items-center min-vh-100 py-4" style={{ background: "#0b0c10" }}>
                <div style={{ maxWidth: "800px", width: "100%", padding: "0 16px" }}>
                    
                    {/* Topbar */}
                    <div className="mb-4 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="brand-badge d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, fontSize: "1.1rem", background: "#4f6ef7", color: "#fff", borderRadius: "10px", fontWeight: "bold" }}>FF</div>
                            <div className="lh-sm">
                                <div className="fw-bold text-white fs-5">
                                    NJ Softtech
                                </div>
                                <div className="small fw-semibold" style={{ color: "#7c9ff7" }}>
                                    Secure Form Gateway
                                </div>
                            </div>
                        </div>

                        <span className="badge d-none d-md-inline-flex align-items-center gap-2 py-2 px-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", borderRadius: "8px" }}>
                            <i className="bi bi-shield-lock" style={{ color: "#3dd68c" }} /> Encrypted
                        </span>
                    </div>

                    {/* Form card explicitly styled dark */}
                    <div className="form-card card shadow-lg border-0" style={{ background: "#11131a", borderRadius: "16px" }}>
                        <div className="card-header p-4 border-0" style={{ background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.06) !important" }}>
                            
                            <div className="text-uppercase fw-bold mb-2" style={{ fontSize: "0.75rem", color: "#7c9ff7", letterSpacing: "1px" }}>
                                {formCategory}
                            </div>
                            
                            <div className="d-flex align-items-start justify-content-between gap-2">
                                <div>
                                    <div className="fw-bold text-white fs-4 mb-1">{formTitle}</div>
                                    {!!formSubtitle && (
                                        <div className="mb-2" style={{ fontSize: ".9rem", color: "#94a3b8" }}>{formSubtitle}</div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="d-flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: "1px dashed rgba(255,255,255,0.05)" }}>
                                <span className="badge" style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: "normal", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <i className="bi bi-asterisk text-danger me-1" /> Required Fields
                                </span>
                                <span className="badge" style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: "normal", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <i className="bi bi-clock me-1" /> ~2 min
                                </span>
                            </div>
                        </div>

                        <div className="card-body p-4 p-md-5 pt-4 text-white">
                            <form noValidate onSubmit={onSubmit}>
                                <div className="row g-4">
                                    {fields.map((f) => {
                                        const err = fieldErrors[f.id] || "";
                                        const showErr = !!err && (submitted || touched[f.id]);
                                        const desc = getFieldDescription(f);

                                        return (
                                            <div key={f.id} className="col-12">
                                                <div className="row g-3 align-items-start">
                                                    {/* LEFT SIDE: Label + Input */}
                                                    <div className="col-12 col-md-7">
                                                        <label className="form-label fw-semibold text-light mb-2">
                                                            {f.label} {f.required && <span className="text-danger">*</span>}
                                                        </label>

                                                        {renderField(
                                                            f,
                                                            values[f.id],
                                                            (v) => handleFieldChange(f, v),
                                                            () => handleFieldBlur(f),
                                                            showErr ? err : ""
                                                        )}

                                                        {showErr && (
                                                            <div className="form-text text-danger mt-1">
                                                                <i className="bi bi-exclamation-circle me-1" /> {err}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* RIGHT SIDE: Description */}
                                                    <div className="col-12 col-md-5">
                                                        {!!desc && (
                                                            <div
                                                                className="small p-3"
                                                                style={{
                                                                    background: "rgba(79,110,247,0.05)",
                                                                    border: "1px solid rgba(79,110,247,0.1)",
                                                                    borderRadius: "8px",
                                                                    color: "#94a3b8",
                                                                    lineHeight: 1.5,
                                                                    marginTop: "28px",
                                                                    whiteSpace: "pre-wrap",
                                                                }}
                                                            >
                                                                <i className="bi bi-info-circle text-primary me-2" />
                                                                {desc}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* CONSENT + OTP BLOCK */}
                                    <div className="col-12 mt-5">
                                        <div className="p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                                            <h6 className="fw-bold mb-3" style={{ color: "#7c9ff7" }}><i className="bi bi-shield-check me-2" /> Verification & Consent</h6>
                                            
                                            <div className="d-flex flex-column gap-3 mb-4">
                                                <label className="form-check d-flex align-items-start gap-3 mb-0" style={{ cursor: "pointer" }}>
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.2)" }}
                                                        checked={consentTruth}
                                                        onChange={(e) => setConsentTruth(e.target.checked)}
                                                    />
                                                    <span className="small text-light" style={{ lineHeight: 1.5 }}>
                                                        I am aware that it is my duty to submit truthful information.
                                                    </span>
                                                </label>

                                                <label className="form-check d-flex align-items-start gap-3 mb-0" style={{ cursor: "pointer" }}>
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.2)" }}
                                                        checked={consentDpdp}
                                                        onChange={(e) => setConsentDpdp(e.target.checked)}
                                                    />
                                                    <span className="small text-light" style={{ lineHeight: 1.5 }}>
                                                        I hereby provide my free, specific, informed, and unambiguous consent to the
                                                        Data Fiduciary for the processing, retention, and use of my personal data in
                                                        accordance with the applicable provisions of the <strong className="text-white">Digital Personal
                                                        Data Protection Act, 2023</strong>.
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 pt-3" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                                                <div className="small fw-semibold text-light">Email / SMS OTP</div>

                                                <div className="position-relative" style={{ maxWidth: "200px", width: "100%" }}>
                                                    <input
                                                        className={`form-control ${otpInput.trim().length === 6 ? otpOk ? "is-valid" : "is-invalid" : ""}`}
                                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                                                        placeholder="Enter 6-digit OTP"
                                                        value={otpInput}
                                                        maxLength={6}
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        onChange={(e) => {
                                                            const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                            setOtpInput(onlyDigits);
                                                        }}
                                                    />
                                                    {otpInput.trim().length === 6 && (
                                                        <span className="position-absolute top-50 translate-middle-y" style={{ right: 12 }}>
                                                            {otpOk ? <i className="bi bi-check-circle-fill text-success" /> : <i className="bi bi-x-circle-fill text-danger" />}
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-nowrap"
                                                    style={{ background: "rgba(79,110,247,0.1)", border: "1px solid rgba(79,110,247,0.2)", color: "#7c9ff7" }}
                                                    onClick={generateOtp6}
                                                    disabled={otpSending}
                                                >
                                                    {otpSending ? <><span className="spinner-border spinner-border-sm me-2"/>Sending</> : otpSent ? "Resend OTP" : "Send OTP"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FOOTER ACTIONS */}
                                    <div className="col-12 mt-4 pt-4 d-flex flex-wrap gap-3 align-items-center justify-content-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="d-none d-md-block text-secondary small">
                                            <i className="bi bi-check2-all me-1" /> Double check your entries
                                        </div>

                                        <div className="d-flex gap-3 ms-auto w-100 w-md-auto">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary px-4 w-100 w-md-auto"
                                                style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                                                onClick={clearForm}
                                            >
                                                Clear
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn px-4 fw-bold w-100 w-md-auto d-flex align-items-center justify-content-center"
                                                style={{ background: "#4f6ef7", color: "#fff", border: "none", borderRadius: "8px" }}
                                                disabled={!canSubmit}
                                                title={!canSubmit ? "Please accept consent and verify OTP to submit" : ""}
                                            >
                                                <i className="bi bi-send me-2" />
                                                Submit Form
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="text-center mt-4 mb-5" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
                        © {year} NJ Softtech • Secure DPDP Gateway
                    </div>
                </div>
            </div>

            {/* CONFIRM POPUP */}
            <PopupAlert
                open={confirmOpen}
                type="warning"
                title="Confirm Submission"
                message="Are you sure you want to submit this form?"
                confirmMode
                confirmText="Yes, Submit"
                cancelText="No"
                onClose={() => setConfirmOpen(false)}
                onConfirm={onConfirmSubmit}
                onCancel={() => setConfirmOpen(false)}
            />

            {/* SUCCESS POPUP */}
            <PopupAlert
                open={successOpen}
                type="success"
                title="Submitted!"
                message="Your response was saved successfully."
                onClose={() => setSuccessOpen(false)}
                autoCloseMs={2000}
            />

            {/* ERROR POPUP */}
            <PopupAlert
                open={dangerOpen}
                type="danger"
                title="Error"
                message={dangerMsg}
                onClose={() => setDangerOpen(false)}
                autoCloseMs={2500}
            />
        </>
    );
};

export default PublicFormView;