// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Modal } from "bootstrap";
// import { useProject } from "../Context/projectContext";
// import type { FormResponseParsed } from "../Api/getFormResponseById";

// type RangeFilter = "All" | "Today" | "Last 7 days" | "Last 30 days";
// type SortFilter = "Newest first" | "Oldest first";

// const withinRange = (iso: string, range: RangeFilter) => {
//     if (range === "All") return true;

//     const d = new Date(iso);
//     const now = new Date();

//     const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     if (range === "Today") return d >= startOfToday;

//     const days = range === "Last 7 days" ? 7 : 30;
//     const from = new Date(now);
//     from.setDate(now.getDate() - days);
//     return d >= from;
// };

// export default function SubmissionsReport() {
//     const navigate = useNavigate();
//     const [params] = useSearchParams();

//     const formId = Number(params.get("form") || 0);
//     // const formName = params.get("name") || "Registration Form";

//     const {
//         formResponses,
//         formResponsesLoading,
//         formResponsesError,
//         fetchFormResponsesByFormId,
//     } = useProject();

//     const [search, setSearch] = useState("");
//     const [range, setRange] = useState<RangeFilter>("All");
//     const [sort, setSort] = useState<SortFilter>("Newest first");

//     const [selected, setSelected] = useState<FormResponseParsed | null>(null);

//     // ✅ Bootstrap modal refs
//     const modalElRef = useRef<HTMLDivElement | null>(null);
//     const modalInstanceRef = useRef<Modal | null>(null);

//     useEffect(() => {
//         if (!modalElRef.current) return;
//         modalInstanceRef.current = new Modal(modalElRef.current, {
//             backdrop: true,
//             keyboard: true,
//             focus: true,
//         });
//         return () => {
//             modalInstanceRef.current?.dispose();
//             modalInstanceRef.current = null;
//         };
//     }, []);

//     useEffect(() => {
//         const el = modalElRef.current;
//         if (!el) return;
//         const onHidden = () => setSelected(null);
//         el.addEventListener("hidden.bs.modal", onHidden);
//         return () => el.removeEventListener("hidden.bs.modal", onHidden);
//     }, []);

//     // const openModal = (row: FormResponseParsed) => {
//     //     setSelected(row);
//     //     requestAnimationFrame(() => modalInstanceRef.current?.show());
//     // };

//     // ✅ fetch list when formId changes
//     useEffect(() => {
//         if (!formId) return;
//         fetchFormResponsesByFormId(formId);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [formId]);

//     const filteredSorted = useMemo(() => {
//         let rows = [...formResponses];

//         const s = search.trim().toLowerCase();
//         if (s) {
//             rows = rows.filter(
//                 (x) =>
//                     (x.EmailId || "").toLowerCase().includes(s) ||
//                     (x.MobileNo || "").toLowerCase().includes(s) ||
//                     (x.Status || "").toLowerCase().includes(s) ||
//                     String(x.Id).includes(s)
//             );
//         }

//         rows = rows.filter((x) => withinRange(x.CreatedOn, range));

//         rows.sort((a, b) => {
//             const da = new Date(a.CreatedOn).getTime();
//             const db = new Date(b.CreatedOn).getTime();
//             return sort === "Newest first" ? db - da : da - db;
//         });

//         return rows;
//     }, [formResponses, search, range, sort]);

//     return (
//         <>
//             <div className="container-fluid app-shell">
//                 <div className="row g-0">
//                     {/* Topbar */}
//                     <div className="panel mb-3">
//                         <div className="panel-head p-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
//                             <div>
//                                 <div className="h5 mb-1">Submissions</div>
//                                 {/* <div className="text-secondary small">
//                                     Form: <span className="badge badge-soft rounded-pill">{formName}</span>
//                                 </div> */}
//                             </div>

//                             <div className="d-flex gap-2 align-items-center">
//                                 <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => navigate("/forms")}>
//                                     <i className="bi bi-arrow-left" /> Back
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Filters */}
//                         <div className="p-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
//                             <div className="input-group" style={{ maxWidth: 520 }}>
//                                 <span className="input-group-text search">
//                                     <i className="bi bi-search" />
//                                 </span>
//                                 <input
//                                     className="form-control search"
//                                     placeholder="Search (email, mobile, status, id)"
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                 />
//                             </div>

//                             <div className="d-flex gap-2">
//                                 <select className="form-select search" style={{ maxWidth: 190 }} value={range}
//                                     onChange={(e) => setRange(e.target.value as RangeFilter)}>
//                                     <option>All</option>
//                                     <option>Today</option>
//                                     <option>Last 7 days</option>
//                                     <option>Last 30 days</option>
//                                 </select>

//                                 <select className="form-select search" style={{ maxWidth: 190 }} value={sort}
//                                     onChange={(e) => setSort(e.target.value as SortFilter)}>
//                                     <option>Newest first</option>
//                                     <option>Oldest first</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Table */}
//                     <div className="panel">
//                         <div className="panel-head p-3 d-flex align-items-center justify-content-between">
//                             <div className="fw-bold">Filled Data</div>
//                             <span className="badge badge-soft rounded-pill">Total: {filteredSorted.length}</span>
//                         </div>

//                         <div className="p-3">
//                             {formResponsesLoading && <div className="text-secondary">Loading...</div>}
//                             {formResponsesError && <div className="alert alert-danger mb-3">{formResponsesError}</div>}

//                             <div className="table-responsive">
//                                 <table className="table align-middle mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th style={{ minWidth: 110 }}>ID</th>
//                                             <th>Email</th>
//                                             <th>Mobile</th>
//                                             <th>Created</th>
//                                             <th>Status</th>
//                                             {/* <th className="text-end" style={{ minWidth: 150 }}>Actions</th> */}
//                                         </tr>
//                                     </thead>

//                                     <tbody>
//                                         {filteredSorted.map((row) => (
//                                             <tr key={row.Id}>
//                                                 <td className="fw-semibold">{row.Id}</td>
//                                                 <td className="text-secondary">{row.EmailId || "-"}</td>
//                                                 <td className="text-secondary">{row.MobileNo || "-"}</td>
//                                                 <td className="text-secondary">
//                                                     {new Date(row.CreatedOn).toLocaleString()}
//                                                 </td>
//                                                 <td>
//                                                     <span className={`badge rounded-pill ${row.Status === "Y" ? "text-bg-success" : "text-bg-secondary"}`}>
//                                                         {row.Status}
//                                                     </span>
//                                                 </td>

//                                                 {/* <td className="text-end">
//                                                     <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => openModal(row)}>
//                                                         <i className="bi bi-eye" /> View
//                                                     </button>
//                                                 </td> */}
//                                             </tr>
//                                         ))}

//                                         {!formResponsesLoading && filteredSorted.length === 0 && (
//                                             <tr>
//                                                 <td colSpan={6} className="text-center text-secondary py-5">
//                                                     No submissions found.
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ Modal */}
//             <div ref={modalElRef} className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
//                 <div className="modal-dialog modal-lg modal-dialog-scrollable">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Submission Details</h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
//                         </div>

//                         <div className="modal-body">
//                             {!selected ? (
//                                 <div className="text-secondary">No data</div>
//                             ) : (
//                                 <>
//                                     <div className="row g-3 mb-3">
//                                         <div className="col-md-6">
//                                             <div className="text-secondary small fw-semibold">Email</div>
//                                             <div className="fw-semibold">{selected.EmailId || "-"}</div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="text-secondary small fw-semibold">Mobile</div>
//                                             <div className="fw-semibold">{selected.MobileNo || "-"}</div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="text-secondary small fw-semibold">IP</div>
//                                             <div className="fw-semibold">{selected.IPAddress || "-"}</div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="text-secondary small fw-semibold">Created</div>
//                                             <div className="fw-semibold">{new Date(selected.CreatedOn).toLocaleString()}</div>
//                                         </div>
//                                     </div>

//                                     <div className="text-secondary small fw-semibold mb-2">FormResponse (JSON)</div>
//                                     <pre className="bg-light p-3 rounded" style={{ maxHeight: 420, overflow: "auto" }}>
//                                         {JSON.stringify(selected.FormResponse, null, 2)}
//                                     </pre>
//                                 </>
//                             )}
//                         </div>

//                         <div className="modal-footer">
//                             <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProject } from "../Context/projectContext";
import { PopupAlert } from "../Components/alert";

type RangeFilter = "All" | "Today" | "Last 7 days" | "Last 30 days";
type SortFilter = "Newest first" | "Oldest first";

/* ================= HELPERS ================= */

const withinRange = (iso: string | undefined | null, range: RangeFilter) => {
    if (range === "All" || !iso) return true;

    const d = new Date(iso);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (range === "Today") return d >= startOfToday;

    const days = range === "Last 7 days" ? 7 : 30;
    const from = new Date(now);
    from.setDate(now.getDate() - days);
    return d >= from;
};

/* ================= COMPONENT ================= */

export default function SubmissionsReport() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const formId = Number(params.get("form") || 0);

    const {
        formResponses,
        formResponsesLoading,
        formResponsesError,
        fetchFormResponsesByFormId,
    } = useProject();

    const [search, setSearch] = useState("");
    const [range, setRange] = useState<RangeFilter>("All");
    const [sort, setSort] = useState<SortFilter>("Newest first");

    // expanded row state
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Delete State & Alerts
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "danger">("success");
    const [alertMsg, setAlertMsg] = useState("");

    /* ================= FETCH ================= */

    useEffect(() => {
        if (!formId) return;
        fetchFormResponsesByFormId(formId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    /* ================= DELETE LOGIC ================= */

    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Prevents the row from expanding when clicking delete
        setItemToDelete(id);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        
        setConfirmDeleteOpen(false);
        setIsDeleting(true);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const apiKey = import.meta.env.VITE_API_KEY;
            const adminCode = localStorage.getItem("ADCODE") || "1";

            const response = await fetch(`${baseUrl}/api/Form/deleteFormResponse?Id=${itemToDelete}`, {
                method: "POST", // Adjust to DELETE if your backend requires it
                headers: {
                    "X-API-KEY": apiKey || "",
                    "X-ADMIN-CODE": adminCode
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete response from server.");
            }

            // Show success
            setAlertType("success");
            setAlertMsg(`Response #${itemToDelete} deleted successfully.`);
            setAlertOpen(true);

            // Refresh the list after deletion
            fetchFormResponsesByFormId(formId);

        } catch (error: any) {
            console.error("Delete error:", error);
            setAlertType("danger");
            setAlertMsg(error.message || "Failed to delete response.");
            setAlertOpen(true);
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    /* ================= FILTER ================= */

    const filteredSorted = useMemo(() => {
        if (!formResponses) return [];
        let rows = [...formResponses];

        const s = search.trim().toLowerCase();
        if (s) {
            rows = rows.filter(
                (x) =>
                    (x.EmailId || "").toLowerCase().includes(s) ||
                    (x.MobileNo || "").toLowerCase().includes(s) ||
                    String(x.Id).includes(s)
            );
        }

        rows = rows.filter((x) => withinRange(x.CreatedOn, range));

        rows.sort((a, b) => {
            const da = a.CreatedOn ? new Date(a.CreatedOn).getTime() : 0;
            const db = b.CreatedOn ? new Date(b.CreatedOn).getTime() : 0;
            return sort === "Newest first" ? db - da : da - db;
        });

        return rows;
    }, [formResponses, search, range, sort]);

    /* ================= RENDER FIELD DATA ================= */

    const renderResponseData = (data: any) => {
        if (!data?.fields || !Array.isArray(data.fields)) {
            return <div className="text-secondary">No structured data found for this response.</div>;
        }

        return (
            <div className="row g-3">
                {data.fields.map((f: any, idx: number) => (
                    <div key={f.id || idx} className="col-md-6">
                        <div className="text-secondary small fw-semibold mb-1">{f.label || "Unknown Field"}</div>
                        {/* 🔥 FIX: Removed text-white and hardcoded colors so it adapts to Light/Dark Mode seamlessly */}
                        <div className="fw-medium" style={{ fontSize: "15px", color: "var(--text-1)" }}>
                            {Array.isArray(f.value)
                                ? f.value.join(", ")
                                : f.value || "—"}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    /* ================= UI ================= */

    return (
        <>
            <div className="container-fluid app-shell">
                <div className="row g-0">

                    {/* TOPBAR */}
                    <div className="panel mb-3">
                        <div className="panel-head p-3 d-flex justify-content-between">
                            <div className="h5 mb-0 d-flex align-items-center">
                                <i className="bi bi-envelope-paper text-primary me-2" /> 
                                Form Responses
                            </div>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => navigate("/forms")}
                                disabled={isDeleting}
                            >
                                <i className="bi bi-arrow-left me-1" /> Back to Forms
                            </button>
                        </div>

                        {/* FILTERS */}
                        <div className="p-3 d-flex flex-wrap gap-2 justify-content-between">
                            <div className="input-group" style={{ maxWidth: 400 }}>
                                <span className="input-group-text search bg-transparent border-end-0">
                                    <i className="bi bi-search" />
                                </span>
                                <input
                                    className="form-control search border-start-0 ps-0"
                                    placeholder="Search email / mobile / id"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <select
                                    className="form-select search"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value as RangeFilter)}
                                >
                                    <option>All</option>
                                    <option>Today</option>
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                </select>

                                <select
                                    className="form-select search"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value as SortFilter)}
                                >
                                    <option>Newest first</option>
                                    <option>Oldest first</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="panel">
                        <div className="panel-head p-3 d-flex justify-content-between align-items-center">
                            <div className="fw-bold">Submitted Data</div>
                            <span className="badge badge-soft rounded-pill px-3">
                                Total: {filteredSorted.length}
                            </span>
                        </div>

                        <div className="p-3">

                            {formResponsesLoading && (
                                <div className="text-center py-4 text-secondary">
                                    <div className="spinner-border spinner-border-sm me-2" /> Loading responses...
                                </div>
                            )}

                            {formResponsesError && <div className="alert alert-danger mb-3">{formResponsesError}</div>}

                            {!formResponsesLoading && !formResponsesError && (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: 90 }}>ID</th>
                                                <th>Email</th>
                                                <th>Mobile</th>
                                                <th>Submitted On</th>
                                                <th className="text-end" style={{ minWidth: 100 }}>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredSorted.map((row) => (
                                                <React.Fragment key={row.Id}>
                                                    {/* MAIN ROW */}
                                                    <tr
                                                        style={{ cursor: "pointer", transition: "background 0.2s" }}
                                                        className={expandedId === row.Id ? "bg-light bg-opacity-10" : ""}
                                                        onClick={() =>
                                                            setExpandedId(expandedId === row.Id ? null : row.Id)
                                                        }
                                                    >
                                                        <td>
                                                            <span className="fw-bold" style={{ color: "var(--brand)" }}>
                                                                {row.Id}
                                                            </span>
                                                        </td>
                                                        <td className="text-secondary">{row.EmailId || "—"}</td>
                                                        <td className="text-secondary">{row.MobileNo || "—"}</td>
                                                        <td className="text-secondary">
                                                            {row.CreatedOn ? new Date(row.CreatedOn).toLocaleString("en-IN") : "—"}
                                                        </td>
                                                        
                                                        <td className="text-end">
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                type="button"
                                                                disabled={isDeleting}
                                                                onClick={(e) => handleDeleteClick(e, row.Id)}
                                                            >
                                                                <i className="bi bi-trash" /> Delete
                                                            </button>
                                                        </td>
                                                    </tr>

                                                    {/* EXPAND DROPDOWN */}
                                                    {expandedId === row.Id && (
                                                        <tr>
                                                            <td colSpan={5} className="p-0 border-0">
                                                                {/* 🔥 FIX: Changed background colors to use adaptive theme variables instead of hardcoded RGBA blocks */}
                                                                <div className="p-4" style={{ background: "var(--card-soft, rgba(128,128,128,0.05))", borderBottom: "1px solid var(--stroke)" }}>
                                                                    <div className="mb-3 fw-bold" style={{ color: "var(--brand)", fontSize: "15px" }}>
                                                                        <i className="bi bi-file-earmark-text me-2" /> Data Filled by User
                                                                    </div>
                                                                    <div className="p-3 rounded bg-secondary bg-opacity-10" style={{ border: "1px solid var(--stroke)" }}>
                                                                        {renderResponseData(row.FormResponse)}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            {filteredSorted.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-secondary py-5">
                                                        <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50" />
                                                        No submissions found for this form.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            <PopupAlert
                open={confirmDeleteOpen}
                type="warning"
                title="Confirm Deletion"
                message={`Are you sure you want to delete form response #${itemToDelete}? This action cannot be undone.`}
                confirmMode={true}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onClose={() => setConfirmDeleteOpen(false)}
                onCancel={() => setConfirmDeleteOpen(false)}
                onConfirm={confirmDelete}
            />

            {/* Success/Error Notification Popup */}
            <PopupAlert
                open={alertOpen}
                type={alertType}
                title={alertType === "success" ? "Success" : "Error"}
                message={alertMsg}
                autoCloseMs={2500}
                onClose={() => setAlertOpen(false)}
            />
        </>
    );
}