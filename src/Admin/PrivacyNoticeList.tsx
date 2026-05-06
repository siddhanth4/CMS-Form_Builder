// import React, { useState } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type NoticeStatus = "Draft" | "Published" | "Archived";

// interface PrivacyNoticeRecord {
//     id: string;
//     noticeName: string;
//     organizationName: string;
//     version: string;
//     effectiveDate: string;
//     language: string;
//     linkedForm: string;
//     status: NoticeStatus;
//     sectionsCompleted: number;
//     totalSections: number;
//     createdBy: string;
//     createdAt: string;
//     lastModified: string;
//     emailsSent: number;
// }

// // ─── Demo Data ────────────────────────────────────────────────────────────────

// const DEMO_NOTICES: PrivacyNoticeRecord[] = [
//     {
//         id: "PN-001",
//         noticeName: "Customer Onboarding Privacy Notice",
//         organizationName: "NJ Softtech Pvt. Ltd.",
//         version: "1.2",
//         effectiveDate: "2024-04-01",
//         language: "English",
//         linkedForm: "Customer Registration Form",
//         status: "Published",
//         sectionsCompleted: 10,
//         totalSections: 10,
//         createdBy: "admin@njsofttech.com",
//         createdAt: "2024-03-15",
//         lastModified: "2024-03-28",
//         emailsSent: 342,
//     },
//     {
//         id: "PN-002",
//         noticeName: "Employee Data Processing Notice",
//         organizationName: "NJ Softtech Pvt. Ltd.",
//         version: "1.0",
//         effectiveDate: "2024-05-01",
//         language: "English",
//         linkedForm: "Employee Onboarding Form",
//         status: "Draft",
//         sectionsCompleted: 6,
//         totalSections: 10,
//         createdBy: "hr@njsofttech.com",
//         createdAt: "2024-04-10",
//         lastModified: "2024-04-18",
//         emailsSent: 0,
//     },
//     {
//         id: "PN-003",
//         noticeName: "Vendor KYC Privacy Notice",
//         organizationName: "NJ Softtech Pvt. Ltd.",
//         version: "2.1",
//         effectiveDate: "2024-01-01",
//         language: "Hindi",
//         linkedForm: "Vendor Registration Form",
//         status: "Archived",
//         sectionsCompleted: 10,
//         totalSections: 10,
//         createdBy: "admin@njsofttech.com",
//         createdAt: "2023-12-01",
//         lastModified: "2024-01-05",
//         emailsSent: 87,
//     },
//     {
//         id: "PN-004",
//         noticeName: "Health Data Consent Notice",
//         organizationName: "NJ Softtech Pvt. Ltd.",
//         version: "1.0",
//         effectiveDate: "2024-06-01",
//         language: "Marathi",
//         linkedForm: "Patient Data Collection Form",
//         status: "Draft",
//         sectionsCompleted: 4,
//         totalSections: 10,
//         createdBy: "dpo@njsofttech.com",
//         createdAt: "2024-05-20",
//         lastModified: "2024-05-22",
//         emailsSent: 0,
//     },
// ];

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const statusBadge = (status: NoticeStatus) => {
//     const map: Record<NoticeStatus, { bg: string; color: string; icon: string }> = {
//         Published: { bg: "rgba(25,135,84,0.15)", color: "#3dd68c", icon: "bi-broadcast" },
//         Draft: { bg: "rgba(255,193,7,0.15)", color: "#ffc107", icon: "bi-pencil-square" },
//         Archived: { bg: "rgba(108,117,125,0.2)", color: "#adb5bd", icon: "bi-archive" },
//     };
//     const s = map[status];
//     return (
//         <span
//             style={{
//                 background: s.bg,
//                 color: s.color,
//                 padding: "3px 10px",
//                 borderRadius: 20,
//                 fontSize: 11,
//                 fontWeight: 600,
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 4,
//             }}
//         >
//             <i className={`bi ${s.icon}`} style={{ fontSize: 10 }} />
//             {status}
//         </span>
//     );
// };

// const completionBar = (done: number, total: number) => {
//     const pct = total > 0 ? Math.round((done / total) * 100) : 0;
//     const color = pct === 100 ? "#198754" : pct >= 60 ? "#ffc107" : "#dc3545";
//     return (
//         <div>
//             <div className="d-flex justify-content-between mb-1">
//                 <span style={{ fontSize: 11, color: "#adb5bd" }}>
//                     {done}/{total} sections
//                 </span>
//                 <span style={{ fontSize: 11, color }}>{pct}%</span>
//             </div>
//             <div
//                 style={{
//                     height: 4,
//                     borderRadius: 2,
//                     background: "rgba(255,255,255,0.07)",
//                     overflow: "hidden",
//                 }}
//             >
//                 <div
//                     style={{
//                         width: `${pct}%`,
//                         height: "100%",
//                         background: color,
//                         borderRadius: 2,
//                         transition: "width 0.3s",
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// interface Props {
//     onCreateNew?: () => void;
//     onEdit?: (id: string) => void;
// }

// const PrivacyNoticeList: React.FC<Props> = ({ onCreateNew, onEdit }) => {
//     const [notices, setNotices] = useState<PrivacyNoticeRecord[]>(DEMO_NOTICES);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [statusFilter, setStatusFilter] = useState<"All" | NoticeStatus>("All");
//     const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
//     const [previewId, setPreviewId] = useState<string | null>(null);

//     const filtered = notices.filter((n) => {
//         const matchSearch =
//             n.noticeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             n.linkedForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             n.id.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchStatus = statusFilter === "All" || n.status === statusFilter;
//         return matchSearch && matchStatus;
//     });

//     const handleDelete = (id: string) => {
//         setNotices((prev) => prev.filter((n) => n.id !== id));
//         setDeleteConfirm(null);
//     };

//     const handleStatusChange = (id: string, newStatus: NoticeStatus) => {
//         setNotices((prev) =>
//             prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
//         );
//     };

//     const stats = {
//         total: notices.length,
//         published: notices.filter((n) => n.status === "Published").length,
//         draft: notices.filter((n) => n.status === "Draft").length,
//         archived: notices.filter((n) => n.status === "Archived").length,
//         emailsSent: notices.reduce((sum, n) => sum + n.emailsSent, 0),
//     };

//     return (
//         <>
//             {/* Delete Confirm Modal */}
//             {deleteConfirm && (
//                 <div
//                     className="modal d-block"
//                     style={{ background: "rgba(0,0,0,0.65)", zIndex: 1055 }}
//                 >
//                     <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
//                         <div
//                             className="modal-content"
//                             style={{
//                                 background: "var(--bs-body-bg, #0f1117)",
//                                 border: "1px solid rgba(220,53,69,0.3)",
//                                 borderRadius: 14,
//                             }}
//                         >
//                             <div className="modal-body p-4 text-center">
//                                 <div
//                                     style={{
//                                         width: 52,
//                                         height: 52,
//                                         borderRadius: "50%",
//                                         background: "rgba(220,53,69,0.12)",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         margin: "0 auto 16px",
//                                     }}
//                                 >
//                                     <i className="bi bi-trash3 text-danger fs-4" />
//                                 </div>
//                                 <h6 className="fw-bold mb-2">Delete Privacy Notice?</h6>
//                                 <p className="text-secondary small mb-4">
//                                     This action cannot be undone. The notice will be permanently
//                                     removed and email delivery will be disabled.
//                                 </p>
//                                 <div className="d-flex gap-2 justify-content-center">
//                                     <button
//                                         className="btn btn-sm"
//                                         style={{
//                                             background: "rgba(255,255,255,0.07)",
//                                             border: "1px solid rgba(255,255,255,0.1)",
//                                             color: "var(--bs-body-color)",
//                                             minWidth: 80,
//                                         }}
//                                         onClick={() => setDeleteConfirm(null)}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         className="btn btn-sm btn-danger"
//                                         style={{ minWidth: 80 }}
//                                         onClick={() => handleDelete(deleteConfirm)}
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="container-fluid">
//                 {/* Header */}
//                 <div className="panel mb-3">
//                     <div className="panel-head p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
//                         <div>
//                             <div className="h5 mb-1 d-flex align-items-center gap-2">
//                                 <i className="bi bi-files text-primary" />
//                                 Privacy Notices
//                             </div>
//                             <div className="text-secondary small">
//                                 Manage DPDP Act, 2023 compliant privacy notices linked to consent
//                                 forms
//                             </div>
//                         </div>
//                         <button
//                             className="btn btn-sm btn-primary d-flex align-items-center gap-2"
//                             onClick={onCreateNew}
//                         >
//                             <i className="bi bi-plus-lg" />
//                             Create New Notice
//                         </button>
//                     </div>
//                 </div>

//                 {/* Stats Row */}
//                 <div className="row g-3 mb-3">
//                     {[
//                         {
//                             label: "Total Notices",
//                             value: stats.total,
//                             icon: "bi-files",
//                             color: "#4f6ef7",
//                         },
//                         {
//                             label: "Published",
//                             value: stats.published,
//                             icon: "bi-broadcast",
//                             color: "#3dd68c",
//                         },
//                         {
//                             label: "Drafts",
//                             value: stats.draft,
//                             icon: "bi-pencil-square",
//                             color: "#ffc107",
//                         },
//                         {
//                             label: "Emails Sent",
//                             value: stats.emailsSent,
//                             icon: "bi-envelope-check",
//                             color: "#5ac8fa",
//                         },
//                     ].map((s) => (
//                         <div key={s.label} className="col-6 col-md-3">
//                             <div className="stat-card">
//                                 <div className="d-flex align-items-center justify-content-between">
//                                     <div>
//                                         <div
//                                             className="text-secondary small"
//                                             style={{ fontWeight: 500 }}
//                                         >
//                                             {s.label}
//                                         </div>
//                                         <div className="stat-value">{s.value}</div>
//                                     </div>
//                                     <div
//                                         className="stat-icon"
//                                         style={{
//                                             background: `${s.color}22`,
//                                             color: s.color,
//                                         }}
//                                     >
//                                         <i className={`bi ${s.icon} fs-5`} />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Filters */}
//                 <div className="panel mb-3">
//                     <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
//                         <div style={{ flex: 1, minWidth: 200, maxWidth: 340 }}>
//                             <div className="input-group input-group-sm">
//                                 <span
//                                     className="input-group-text"
//                                     style={{
//                                         background: "rgba(255,255,255,0.05)",
//                                         border: "1px solid rgba(255,255,255,0.12)",
//                                         borderRight: "none",
//                                         color: "#adb5bd",
//                                     }}
//                                 >
//                                     <i className="bi bi-search" />
//                                 </span>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Search notices..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     style={{
//                                         borderLeft: "none",
//                                     }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="d-flex gap-1">
//                             {(["All", "Published", "Draft", "Archived"] as const).map((s) => (
//                                 <button
//                                     key={s}
//                                     onClick={() => setStatusFilter(s)}
//                                     className="btn btn-sm"
//                                     style={{
//                                         background:
//                                             statusFilter === s
//                                                 ? "rgba(79,110,247,0.2)"
//                                                 : "rgba(255,255,255,0.04)",
//                                         border: `1px solid ${
//                                             statusFilter === s
//                                                 ? "rgba(79,110,247,0.4)"
//                                                 : "rgba(255,255,255,0.1)"
//                                         }`,
//                                         color:
//                                             statusFilter === s
//                                                 ? "#7c9ff7"
//                                                 : "var(--bs-secondary-color)",
//                                         fontSize: 12,
//                                     }}
//                                 >
//                                     {s}
//                                 </button>
//                             ))}
//                         </div>

//                         <span className="ms-auto text-secondary small">
//                             {filtered.length} notice{filtered.length !== 1 ? "s" : ""}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="panel">
//                     {filtered.length === 0 ? (
//                         <div
//                             className="text-center py-5 text-secondary"
//                             style={{ fontSize: 14 }}
//                         >
//                             <i
//                                 className="bi bi-file-earmark-x mb-2 d-block"
//                                 style={{ fontSize: 36, opacity: 0.3 }}
//                             />
//                             No privacy notices found
//                         </div>
//                     ) : (
//                         <div className="table-responsive">
//                             <table className="table align-middle mb-0">
//                                 <thead>
//                                     <tr>
//                                         <th style={{ minWidth: 240 }}>Notice</th>
//                                         <th style={{ minWidth: 160 }}>Linked Form</th>
//                                         <th style={{ minWidth: 100 }}>Status</th>
//                                         <th style={{ minWidth: 130 }}>Completion</th>
//                                         <th style={{ minWidth: 90 }}>Emails Sent</th>
//                                         <th style={{ minWidth: 100 }}>Last Modified</th>
//                                         <th style={{ minWidth: 120, textAlign: "right" }}>
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filtered.map((n) => (
//                                         <tr key={n.id}>
//                                             <td>
//                                                 <div className="d-flex align-items-start gap-2">
//                                                     <div
//                                                         style={{
//                                                             width: 36,
//                                                             height: 36,
//                                                             borderRadius: 8,
//                                                             background:
//                                                                 "rgba(79,110,247,0.12)",
//                                                             display: "flex",
//                                                             alignItems: "center",
//                                                             justifyContent: "center",
//                                                             flexShrink: 0,
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-file-earmark-lock2 text-primary" />
//                                                     </div>
//                                                     <div>
//                                                         <div
//                                                             className="fw-semibold"
//                                                             style={{ fontSize: 13 }}
//                                                         >
//                                                             {n.noticeName}
//                                                         </div>
//                                                         <div
//                                                             className="text-secondary"
//                                                             style={{ fontSize: 11 }}
//                                                         >
//                                                             {n.id} · v{n.version} ·{" "}
//                                                             {n.language}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div style={{ fontSize: 13 }}>
//                                                     {n.linkedForm ? (
//                                                         <>
//                                                             <i className="bi bi-link-45deg me-1 text-primary" />
//                                                             {n.linkedForm}
//                                                         </>
//                                                     ) : (
//                                                         <span className="text-secondary">—</span>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                             <td>{statusBadge(n.status)}</td>
//                                             <td>
//                                                 {completionBar(
//                                                     n.sectionsCompleted,
//                                                     n.totalSections
//                                                 )}
//                                             </td>
//                                             <td>
//                                                 <div className="d-flex align-items-center gap-1">
//                                                     <i
//                                                         className="bi bi-envelope-check"
//                                                         style={{
//                                                             fontSize: 12,
//                                                             color:
//                                                                 n.emailsSent > 0
//                                                                     ? "#5ac8fa"
//                                                                     : "#6c757d",
//                                                         }}
//                                                     />
//                                                     <span
//                                                         style={{
//                                                             fontSize: 13,
//                                                             color:
//                                                                 n.emailsSent > 0
//                                                                     ? "#dee2e6"
//                                                                     : "#6c757d",
//                                                         }}
//                                                     >
//                                                         {n.emailsSent}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <span
//                                                     className="text-secondary"
//                                                     style={{ fontSize: 12 }}
//                                                 >
//                                                     {n.lastModified}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <div className="d-flex gap-1 justify-content-end">
//                                                     {/* Edit */}
//                                                     <button
//                                                         className="btn btn-sm"
//                                                         style={{
//                                                             background:
//                                                                 "rgba(79,110,247,0.12)",
//                                                             border: "none",
//                                                             color: "#7c9ff7",
//                                                             padding: "4px 8px",
//                                                             fontSize: 12,
//                                                         }}
//                                                         title="Edit"
//                                                         onClick={() => onEdit?.(n.id)}
//                                                     >
//                                                         <i className="bi bi-pencil" />
//                                                     </button>

//                                                     {/* Publish / Archive toggle */}
//                                                     {n.status === "Draft" && (
//                                                         <button
//                                                             className="btn btn-sm"
//                                                             style={{
//                                                                 background:
//                                                                     "rgba(25,135,84,0.12)",
//                                                                 border: "none",
//                                                                 color: "#3dd68c",
//                                                                 padding: "4px 8px",
//                                                                 fontSize: 12,
//                                                             }}
//                                                             title="Publish"
//                                                             onClick={() =>
//                                                                 handleStatusChange(
//                                                                     n.id,
//                                                                     "Published"
//                                                                 )
//                                                             }
//                                                         >
//                                                             <i className="bi bi-broadcast" />
//                                                         </button>
//                                                     )}
//                                                     {n.status === "Published" && (
//                                                         <button
//                                                             className="btn btn-sm"
//                                                             style={{
//                                                                 background:
//                                                                     "rgba(108,117,125,0.15)",
//                                                                 border: "none",
//                                                                 color: "#adb5bd",
//                                                                 padding: "4px 8px",
//                                                                 fontSize: 12,
//                                                             }}
//                                                             title="Archive"
//                                                             onClick={() =>
//                                                                 handleStatusChange(
//                                                                     n.id,
//                                                                     "Archived"
//                                                                 )
//                                                             }
//                                                         >
//                                                             <i className="bi bi-archive" />
//                                                         </button>
//                                                     )}
//                                                     {n.status === "Archived" && (
//                                                         <button
//                                                             className="btn btn-sm"
//                                                             style={{
//                                                                 background:
//                                                                     "rgba(255,193,7,0.12)",
//                                                                 border: "none",
//                                                                 color: "#ffc107",
//                                                                 padding: "4px 8px",
//                                                                 fontSize: 12,
//                                                             }}
//                                                             title="Restore to Draft"
//                                                             onClick={() =>
//                                                                 handleStatusChange(
//                                                                     n.id,
//                                                                     "Draft"
//                                                                 )
//                                                             }
//                                                         >
//                                                             <i className="bi bi-arrow-counterclockwise" />
//                                                         </button>
//                                                     )}

//                                                     {/* Delete */}
//                                                     <button
//                                                         className="btn btn-sm"
//                                                         style={{
//                                                             background:
//                                                                 "rgba(220,53,69,0.1)",
//                                                             border: "none",
//                                                             color: "#f86e7a",
//                                                             padding: "4px 8px",
//                                                             fontSize: 12,
//                                                         }}
//                                                         title="Delete"
//                                                         onClick={() =>
//                                                             setDeleteConfirm(n.id)
//                                                         }
//                                                     >
//                                                         <i className="bi bi-trash3" />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

import React, { useState, useEffect } from "react";
import { getNoticesList, deleteNotice } from "../Api/noticeApi";

type NoticeStatus = "Draft" | "Published";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getPrivacyNoticeName = (notice: any, id: string) => {
    return (
        notice.noticeName || notice.NoticeName || notice.name || notice.Name || notice.title || notice.Title || notice.privacyNoticeName || notice.PrivacyNoticeName ||
        (notice.notice || notice.Notice ? extractTitleFromContent(notice.notice || notice.Notice) : null) ||
        `Privacy Notice ${id}`
    );
};

const extractTitleFromContent = (content: string) => {
    if (!content || typeof content !== "string") return null;
    const titleMatch = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (titleMatch && titleMatch[1]) return titleMatch[1].replace(/<[^>]*>/g, "").trim();
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (firstParagraph && firstParagraph[1]) {
        const text = firstParagraph[1].replace(/<[^>]*>/g, "").trim();
        if (text.length < 100 && !text.includes(".")) return text;
    }
    return null;
};

const statusBadge = (status: NoticeStatus | string) => {
    const badgeClass = status === "Draft" ? "badge text-bg-warning rounded-pill" : "badge text-bg-success rounded-pill";
    return <span className={badgeClass}>{status || "Published"}</span>;
};

const completionBar = (done: number, total: number) => {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return (
        <div style={{ maxWidth: "200px" }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-secondary small">{done}/{total} sections</div>
                <div className="fw-semibold small">{pct}%</div>
            </div>
            <div className="progress" role="progressbar" aria-label={`${pct}% complete`} style={{ height: "6px", background: "rgba(255,255,255,0.1)" }}>
                <div className={`progress-bar ${pct === 100 ? "bg-success" : "bg-warning"}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

const getCreationDate = (n: any) => {
    const dateStr = n.createdOn || n.CreatedOn || n.createdAt || n.CreatedAt || n.lastModified || n.LastModified || n.TTime;
    if (!dateStr) return "—";
    try { return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } 
    catch { return "—"; }
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
    onCreateNew?: () => void;
    onEdit?: (id: string, noticeData: any) => void;
}

const PrivacyNoticeList: React.FC<Props> = ({ onCreateNew, onEdit }) => {
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | NoticeStatus | string>("All");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => { loadNotices(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

    const loadNotices = async () => {
        try {
            setLoading(true);
            const res = await getNoticesList();
            let data = [];
            if (res?.data) { data = typeof res.data === "string" ? JSON.parse(res.data) : res.data; } 
            else if (Array.isArray(res)) { data = res; }
            setNotices(data);
        } catch (err) { console.error("Error loading notices", err); } 
        finally { setLoading(false); }
    };

    // 🔥 FIX: Scans the invisible text block to accurately pull "Draft" and Completion Ratio
    const getTrueStats = (n: any) => {
        const html = n.notice || n.Notice || n.noticeContent || "";
        const match = html.match(/\[META_v1_([A-Za-z]+)_(\d+)_(\d+)_([^\]]+)\]/);
        
        if (match) {
            return { mappedStatus: match[1], done: parseInt(match[2], 10), total: parseInt(match[3], 10), html: html };
        }
        return { mappedStatus: n.status || n.Status || "Published", done: n.sectionsCompleted ?? 10, total: n.totalSections ?? 10, html: html };
    };

    const filtered = [...notices].reverse().filter((n, i) => {
        const id = String(n.id || n.Id || n.noticeId || n.NoticeId || i);
        const name = getPrivacyNoticeName(n, id);
        const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const { mappedStatus } = getTrueStats(n);
        const matchStatus = statusFilter === "All" || mappedStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginatedNotices = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // const handleDelete = (id: string) => {
    //     setNotices((prev) => prev.filter((n) => String(n.id || n.Id || n.NoticeId) !== id));
    //     setDeleteConfirm(null);
    // };
    const handleDelete = async (id: string) => {
    try {
        // 1. Tell the backend to permanently delete it
        await deleteNotice(id);

        // 2. Remove it from the React UI list
        setNotices((prev) => prev.filter((n) => String(n.id || n.Id || n.NoticeId) !== id));
        setDeleteConfirm(null);
        
    } catch (err) {
        console.error("Failed to delete notice", err);
        alert("Failed to delete the notice from the database. Please check the console.");
    }
};

    const stats = {
        total: notices.length,
        published: notices.filter((n) => getTrueStats(n).mappedStatus === "Published").length,
        draft: notices.filter((n) => getTrueStats(n).mappedStatus === "Draft").length,
    };

    return (
        <>
            {previewHtml !== null && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.65)", zIndex: 1055 }} onClick={() => setPreviewHtml(null)}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content" style={{ background: "var(--bs-body-bg, #0f1117)", border: "1px solid rgba(79,110,247,0.3)" }}>
                            <div className="modal-header border-bottom border-secondary">
                                <h5 className="modal-title fw-bold text-primary"><i className="bi bi-eye me-2" /> Notice Preview</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewHtml(null)} />
                            </div>
                            <div className="modal-body p-4" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.65)", zIndex: 1055 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
                        <div className="modal-content" style={{ background: "var(--bs-body-bg, #0f1117)", border: "1px solid rgba(220,53,69,0.3)", borderRadius: 14 }}>
                            <div className="modal-body p-4 text-center">
                                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(220,53,69,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <i className="bi bi-trash3 text-danger fs-4" />
                                </div>
                                <h6 className="fw-bold mb-2">Delete Privacy Notice?</h6>
                                <p className="text-secondary small mb-4">This action cannot be undone.</p>
                                <div className="d-flex gap-2 justify-content-center mt-4">
                                    <button className="btn btn-sm btn-outline-secondary" style={{ minWidth: 80 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                                    <button className="btn btn-sm btn-danger" style={{ minWidth: 80 }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid app-shell">
                <div className="row g-0">
                    <div className="panel mb-3">
                        <div className="panel-head p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                            <div>
                                <div className="h5 mb-1">Privacy Notices</div>
                                <div className="text-secondary small">Manage DPDP Act, 2023 compliant privacy notices</div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-secondary" onClick={loadNotices}>
                                    <i className="bi bi-arrow-clockwise" /> Refresh
                                </button>
                                <button className="btn btn-sm btn-primary d-flex align-items-center gap-2" onClick={onCreateNew}>
                                    <i className="bi bi-plus-lg" /> Create New Notice
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        {[
                            { label: "Total Notices", value: stats.total, icon: "bi-files", color: "#4f6ef7" },
                            { label: "Published", value: stats.published, icon: "bi-broadcast", color: "#3dd68c" },
                            { label: "Drafts", value: stats.draft, icon: "bi-pencil-square", color: "#ffc107" },
                        ].map((s) => (
                            // Changed col-6 col-md-3 to col-12 col-md-4 so 3 cards stretch perfectly
                            <div key={s.label} className="col-12 col-md-4">
                                <div className="stat-card">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="text-secondary small" style={{ fontWeight: 500 }}>{s.label}</div>
                                            <div className="stat-value">{s.value}</div>
                                        </div>
                                        <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>
                                            <i className={`bi ${s.icon} fs-5`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="panel mb-3">
                        <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
                            <div style={{ flex: 1, minWidth: 200, maxWidth: 340 }}>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRight: "none", color: "#adb5bd" }}><i className="bi bi-search" /></span>
                                    <input type="text" className="form-control" placeholder="Search notices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderLeft: "none" }} />
                                </div>
                            </div>

                            <div className="d-flex gap-1">
                                {["All", "Published", "Draft"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className="btn btn-sm"
                                        style={{
                                            background: statusFilter === s ? "rgba(79,110,247,0.2)" : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${statusFilter === s ? "rgba(79,110,247,0.4)" : "rgba(255,255,255,0.1)"}`,
                                            color: statusFilter === s ? "#7c9ff7" : "var(--bs-secondary-color)",
                                            fontSize: 12,
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <span className="ms-auto text-secondary small">
                                {filtered.length} notice{filtered.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    <div className="panel">
                        {loading ? (
                            <div className="text-center py-5 text-secondary">
                                <div className="spinner-border spinner-border-sm me-2" /> Loading notices...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-5 text-secondary" style={{ fontSize: 14 }}>
                                <i className="bi bi-file-earmark-x mb-2 d-block" style={{ fontSize: 36, opacity: 0.3 }} /> No privacy notices found
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0 table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: 280, paddingLeft: 20 }}>Notice</th>
                                                <th style={{ minWidth: 120 }}>Status</th>
                                                <th style={{ minWidth: 160 }}>Completion</th>
                                                <th style={{ minWidth: 140 }}>Date Created</th>
                                                <th className="text-end" style={{ minWidth: 180, paddingRight: 20 }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedNotices.map((n, i) => {
                                                const id = String(n.id || n.Id || n.noticeId || n.NoticeId || i);
                                                const name = getPrivacyNoticeName(n, id);
                                                
                                                // Extract accurate mapped stats
                                                const { mappedStatus, done, total, html } = getTrueStats(n);

                                                return (
                                                    <tr key={id}>
                                                        <td style={{ paddingLeft: 20 }}>
                                                            <div className="d-flex align-items-center gap-3 w-100">
                                                                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(79,110,247,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                    <i className="bi bi-file-earmark-lock2 text-primary" />
                                                                </div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div className="fw-semibold text-truncate" style={{ fontSize: 14, maxWidth: "250px" }} title={name}>{name}</div>
                                                                    <div className="text-secondary mt-1" style={{ fontSize: 11 }}>ID: {id} {n.version ? ` · v${n.version}` : ""}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{statusBadge(mappedStatus)}</td>
                                                        <td>{completionBar(done, total)}</td>
                                                        <td><span className="text-secondary fw-medium" style={{ fontSize: 13 }}>{getCreationDate(n)}</span></td>
                                                        <td className="text-end" style={{ paddingRight: 20 }}>
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                {mappedStatus === "Draft" && onEdit && (
                                                                    <button className="btn btn-sm btn-outline-warning" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => onEdit(id, n)}>
                                                                        <i className="bi bi-pencil-square me-1" /> Complete Draft
                                                                    </button>
                                                                )}
                                                                {mappedStatus !== "Draft" && (
                                                                    <button className="btn btn-sm btn-outline-primary" style={{ padding: "4px 10px", fontSize: 12, border: "none", background: "rgba(79,110,247,0.1)", color: "#7c9ff7" }} onClick={() => setPreviewHtml(html)}>
                                                                        <i className="bi bi-eye me-1" /> Preview
                                                                    </button>
                                                                )}
                                                                <button className="btn btn-sm" style={{ background: "rgba(220,53,69,0.1)", border: "none", color: "#f86e7a", padding: "4px 10px", fontSize: 12 }} title="Delete" onClick={() => setDeleteConfirm(id)}>
                                                                    <i className="bi bi-trash3" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 border-top">
                                        <div className="text-secondary small">Page {currentPage} of {totalPages} • Showing {paginatedNotices.length} records</div>
                                        <nav>
                                            <ul className="pagination pagination-sm mb-0">
                                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</button></li>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((page) => (
                                                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}><button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button></li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</button></li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyNoticeList;