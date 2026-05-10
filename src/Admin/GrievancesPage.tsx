/**
 * src/Admin/GrievancesPage.tsx
 */
import React, { useEffect, useMemo, useState } from "react";
import { getGrievanceList, addAdminReply } from "../Api/grievance";
import type {
    Grievance,
    GrievancePriority,
    GrievanceStatus,
    GrievanceType,
} from "../Api/grievance";

/* ── local types / helpers unchanged ─────────────────────────────── */
type RangeFilter = "All" | "Today" | "Last 7 days" | "Last 30 days";

const priorityConfig: Record<GrievancePriority, { bg: string; color: string; dot: string }> = {
    Low:      { bg: "var(--success-soft)",  color: "#3dd68c", dot: "#3dd68c" },
    Medium:   { bg: "rgba(255,193,7,0.12)", color: "#ffc107", dot: "#ffc107" },
    High:     { bg: "rgba(253,126,20,0.15)", color: "#fd8c3a", dot: "#fd8c3a" },
    Critical: { bg: "rgba(220,53,69,0.15)", color: "#f86e7a", dot: "#dc3545" },
};
const statusConfig: Record<GrievanceStatus, { bg: string; color: string; icon: string }> = {
    "Open":        { bg: "rgba(13,202,240,0.12)",  color: "#5ac8fa", icon: "bi-circle"      },
    "In Progress": { bg: "rgba(255,193,7,0.12)",   color: "#ffc107", icon: "bi-arrow-repeat" },
    "Resolved":    { bg: "var(--success-soft)",    color: "#3dd68c", icon: "bi-check-circle" },
    "Closed":      { bg: "rgba(108,117,125,0.15)", color: "#adb5bd", icon: "bi-x-circle"    },
};

const PriorityBadge: React.FC<{ p: GrievancePriority }> = ({ p }) => {
    const c = priorityConfig[p];
    return (
        <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
            {p}
        </span>
    );
};

const StatusBadge: React.FC<{ s: GrievanceStatus }> = ({ s }) => {
    const c = statusConfig[s];
    return (
        <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <i className={`bi ${c.icon}`} style={{ fontSize: 10 }} />
            {s}
        </span>
    );
};

const withinRange = (iso: string, range: RangeFilter) => {
    if (range === "All") return true;
    const d   = new Date(iso);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (range === "Today") return d >= startOfToday;
    const days = range === "Last 7 days" ? 7 : 30;
    const from = new Date(now);
    from.setDate(now.getDate() - days);
    return d >= from;
};

const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

/* ══════════════════════════════════════════════════════════════════════
   RESOLVE PANEL 
══════════════════════════════════════════════════════════════════════ */
const ResolvePanel: React.FC<{
    grievance: Grievance;
    onResolved: (updated: Grievance) => void;
    onClose: () => void;
}> = ({ grievance, onResolved, onClose }) => {
    const [replyMessage,   setReplyMessage]   = useState(grievance.Resolution?.text       ?? "");
    const [resolvedBy,     setResolvedBy]     = useState(grievance.Resolution?.resolvedBy ?? "");
    const [replyErr,       setReplyErr]       = useState("");
    const [resolvedByErr,  setResolvedByErr]  = useState("");
    const [saving,         setSaving]         = useState(false);
    const [apiError,       setApiError]       = useState("");

    const alreadyResolved =
        grievance.Status === "Resolved" || grievance.Status === "Closed";

    const handleSubmit = async () => {
        let valid = true;
        if (!replyMessage.trim()) { setReplyErr("Reply / resolution note is required.");  valid = false; } else setReplyErr("");
        if (!resolvedBy.trim())   { setResolvedByErr("Please enter your name / designation."); valid = false; } else setResolvedByErr("");
        if (!valid) return;

        try {
            setSaving(true);
            setApiError("");

            await addAdminReply({
                GrievanceId:  grievance.Id,
                ResponseId:   grievance.ResponseId, 
                ReplyMessage: `RESOLUTION by ${resolvedBy.trim()}:\n\n${replyMessage.trim()}`,
            });

            const updated: Grievance = {
                ...grievance,
                Status: "Resolved",
                Resolution: {
                    text:       replyMessage.trim(),
                    resolvedBy: resolvedBy.trim(),
                    resolvedAt: new Date().toISOString(),
                },
            };
            onResolved(updated);
        } catch (err: any) {
            setApiError(err?.message || "Failed to send reply. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ borderTop: "1px solid var(--stroke)", padding: "20px 24px", background: "var(--soft-2)", animation: "fadeIn .15s ease" }}>
            {/* Heading */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: 32, height: 32, borderRadius: 8, background: alreadyResolved ? "var(--success-soft)" : "var(--soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`bi ${alreadyResolved ? "bi-check-circle text-success" : "bi-pencil-square text-primary"}`} />
                </div>
                <div>
                    <div className="fw-semibold" style={{ fontSize: 14, color: "var(--text-1)" }}>
                        {alreadyResolved ? "Resolution Details" : "Resolve Grievance"}
                    </div>
                    <div className="text-secondary" style={{ fontSize: 11 }}>
                        Grievance: <span style={{ fontFamily: "monospace" }}>GRV-{grievance.Id}</span>
                        {" · "}Response: <span style={{ fontFamily: "monospace" }}>#{grievance.ResponseId}</span>
                    </div>
                </div>
                <button type="button" onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-2)", fontSize: 18, cursor: "pointer" }}>
                    <i className="bi bi-x" />
                </button>
            </div>

            {/* Full issue details */}
            <div className="mb-4 p-3" style={{ background: "var(--bg-1)", borderRadius: 8, border: "1px solid var(--stroke)", fontSize: 13 }}>
                <div className="d-flex align-items-center gap-2 mb-3 flex-wrap pb-2" style={{ borderBottom: "1px solid var(--stroke)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--soft)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "var(--brand)", flexShrink: 0 }}>
                        {(grievance.UserName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="fw-semibold" style={{ color: "var(--text-1)" }}>{grievance.UserName || "Unknown"}</div>
                        <div style={{ fontSize: 11, color: "var(--text-2)" }}>
                            <i className="bi bi-envelope me-1" />{grievance.UserEmail || "—"}
                            <span className="mx-2">·</span>
                            <i className="bi bi-phone me-1" />{grievance.UserMobile || "—"}
                        </div>
                    </div>
                    <div className="ms-auto text-end" style={{ fontSize: 11, color: "var(--text-2)" }}>
                        <div><i className="bi bi-calendar3 me-1" />{fmt(grievance.FiledOn)}</div>
                        <div><i className="bi bi-file-earmark me-1 text-primary" />Form #{grievance.FormId}</div>
                    </div>
                </div>
                <div className="mb-2 d-flex align-items-center gap-2 flex-wrap">
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Issue Type</span>
                    <span style={{ background: "rgba(255,193,7,0.1)", color: "#ffc107", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {grievance.IssueType}
                    </span>
                    <PriorityBadge p={grievance.Priority} />
                    <StatusBadge s={grievance.Status} />
                </div>
                <div style={{ color: "var(--text-1)", lineHeight: 1.8, whiteSpace: "pre-wrap", marginTop: 8, padding: "12px", background: "var(--bg-2)", borderRadius: 6, border: "1px solid var(--stroke)" }}>
                    {grievance.IssueDescription}
                </div>
            </div>

            {/* Resolution form */}
            {!alreadyResolved && (
                <div className="mb-3 p-3 d-flex align-items-start gap-2" style={{ background: "var(--success-soft)", borderRadius: 8, border: "1px solid rgba(25,135,84,0.2)", fontSize: 13, color: "var(--text-1)" }}>
                    <i className="bi bi-envelope-check mt-1 text-success flex-shrink-0" />
                    <div>
                        The resolution note will be <strong>emailed directly</strong> to{" "}
                        <strong className="text-success">{grievance.UserEmail}</strong> once you submit.
                    </div>
                </div>
            )}
            {apiError && (
                <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13 }}>
                    <i className="bi bi-exclamation-circle me-2" />{apiError}
                </div>
            )}
            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label small fw-semibold" style={{ color: "var(--text-1)" }}>
                        Resolution Note <span className="text-danger">*</span>
                    </label>
                    <textarea
                        className={`form-control ${replyErr ? "is-invalid" : ""}`}
                        rows={5}
                        placeholder="Describe the resolution steps taken. This note will be emailed to the user and stored as an audit record under DPDP Act, 2023..."
                        value={replyMessage}
                        readOnly={alreadyResolved}
                        style={{ fontSize: 13, lineHeight: 1.7, resize: "vertical", background: alreadyResolved ? "var(--bg-1)" : "var(--bg-0)", color: "var(--text-1)", border: "1px solid var(--stroke)" }}
                        onChange={(e) => { setReplyMessage(e.target.value); if (e.target.value.trim()) setReplyErr(""); }}
                    />
                    {replyErr && <div className="invalid-feedback d-block">{replyErr}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: "var(--text-1)" }}>
                        Resolved By (Name / Designation) <span className="text-danger">*</span>
                    </label>
                    <input
                        className={`form-control ${resolvedByErr ? "is-invalid" : ""}`}
                        placeholder="e.g., DPO — Meena Joshi"
                        value={resolvedBy}
                        readOnly={alreadyResolved}
                        style={{ fontSize: 13, background: alreadyResolved ? "var(--bg-1)" : "var(--bg-0)", color: "var(--text-1)", border: "1px solid var(--stroke)" }}
                        onChange={(e) => { setResolvedBy(e.target.value); if (e.target.value.trim()) setResolvedByErr(""); }}
                    />
                    {resolvedByErr && <div className="invalid-feedback d-block">{resolvedByErr}</div>}
                </div>
                {alreadyResolved && grievance.Resolution?.resolvedAt && (
                    <div className="col-md-6">
                        <label className="form-label small fw-semibold" style={{ color: "var(--text-1)" }}>Resolved At</label>
                        <input
                            className="form-control"
                            readOnly
                            value={fmt(grievance.Resolution.resolvedAt)}
                            style={{ fontSize: 13, background: "var(--bg-1)", color: "var(--text-1)", border: "1px solid var(--stroke)" }}
                        />
                    </div>
                )}
            </div>
            {/* Footer actions */}
            {!alreadyResolved ? (
                <div className="d-flex gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-sm"
                        style={{ background: "transparent", border: "1px solid var(--stroke)", color: "var(--text-1)" }}
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm"
                        style={{ background: saving ? "rgba(25,135,84,0.3)" : "linear-gradient(135deg,#198754,#28a745)", border: "none", color: "#fff", minWidth: 160 }}
                        disabled={saving}
                        onClick={handleSubmit}
                    >
                        {saving ? (
                            <><span className="spinner-border spinner-border-sm me-2" />Resolving &amp; Sending Email…</>
                        ) : (
                            <><i className="bi bi-send-check me-2" />Resolve &amp; Send Email</>
                        )}
                    </button>
                </div>
            ) : (
                <div className="mt-3 d-flex align-items-center gap-2" style={{ fontSize: 12, color: "#3dd68c" }}>
                    <i className="bi bi-shield-check" />
                    This grievance has been resolved. An email was sent to the user and the audit record is stored.
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   GRIEVANCE ROW
══════════════════════════════════════════════════════════════════════ */
const GrievanceRow: React.FC<{
    g: Grievance;
    isExpanded: boolean;
    onToggle: (id: number) => void;
    onResolved: (updated: Grievance) => void;
}> = ({ g, isExpanded, onToggle, onResolved }) => {
    const isResolved = g.Status === "Resolved" || g.Status === "Closed";
    return (
        <div style={{ border: `1px solid ${isExpanded ? "var(--brand)" : "var(--stroke)"}`, borderRadius: 12, overflow: "hidden", background: isExpanded ? "var(--soft-2)" : "var(--bg-1)", transition: "border-color 0.2s, background 0.2s", marginBottom: 12 }}>
            {/* Row header */}
            <div style={{ padding: "14px 18px", cursor: "pointer" }} onClick={() => onToggle(g.Id)}>
                <div className="d-flex flex-wrap align-items-start gap-3">
                    {/* Left: ID + description */}
                    <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                            <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--brand)", background: "var(--soft)", padding: "1px 8px", borderRadius: 4 }}>
                                GRV-{g.Id}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#ffc107", background: "rgba(255,193,7,0.1)", padding: "1px 8px", borderRadius: 4 }}>
                                {g.IssueType}
                            </span>
                        </div>
                        <div className="fw-semibold" style={{ fontSize: 14, lineHeight: 1.4, color: "var(--text-1)" }}>
                            {g.IssueDescription.length > 90 ? g.IssueDescription.slice(0, 90) + "…" : g.IssueDescription}
                        </div>
                        <div className="d-flex align-items-center gap-1 mt-1" style={{ fontSize: 12, color: "var(--text-2)" }}>
                            <i className="bi bi-link-45deg text-primary" />{g.FormName}
                        </div>
                    </div>
                    {/* Right: meta */}
                    <div className="d-flex flex-wrap gap-2 align-items-center" style={{ flexShrink: 0 }}>
                        <PriorityBadge p={g.Priority} />
                        <StatusBadge s={g.Status} />
                        <div style={{ fontSize: 12, color: "var(--text-2)", textAlign: "right" }}>
                            <div><i className="bi bi-person me-1" />{g.UserName || "Unknown"}</div>
                            <div style={{ fontFamily: "monospace", fontSize: 11 }}>{timeAgo(g.FiledOn)}</div>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(g.Id); }}
                            style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${isResolved ? "rgba(25,135,84,0.3)" : "var(--brand)"}`, fontSize: 12, fontWeight: 600, cursor: "pointer", background: isResolved ? "var(--success-soft)" : "var(--soft)", color: isResolved ? "#3dd68c" : "var(--brand)", display: "flex", alignItems: "center", gap: 5, transition: "background 0.15s" }}>
                            <i className={`bi ${isResolved ? "bi-eye" : "bi-check2-circle"}`} />
                            {isResolved ? "View" : "Resolve"}
                        </button>
                        <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ color: "var(--text-3)", fontSize: 13 }} />
                    </div>
                </div>
                {/* Meta strip */}
                <div className="d-flex flex-wrap gap-3 mt-2" style={{ fontSize: 11, color: "var(--text-2)" }}>
                    <span><i className="bi bi-fingerprint me-1 text-primary" /><span style={{ fontFamily: "monospace" }}>{g.ConsentId}</span></span>
                    <span><i className="bi bi-envelope me-1" />{g.UserEmail || "—"}</span>
                    <span><i className="bi bi-phone me-1" />{g.UserMobile || "—"}</span>
                    <span><i className="bi bi-calendar3 me-1" />{fmt(g.FiledOn)}</span>
                </div>
            </div>
            {/* Expanded resolve panel */}
            {isExpanded && (
                <ResolvePanel
                    grievance={g}
                    onResolved={(updated) => { onResolved(updated); onToggle(g.Id); }}
                    onClose={() => onToggle(g.Id)}
                />
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */
const GrievancesPage: React.FC = () => {
    const [grievances,     setGrievances]     = useState<Grievance[]>([]);
    const [loading,        setLoading]        = useState(false);
    const [error,          setError]          = useState("");
    const [search,         setSearch]         = useState("");
    const [rangeFilter,    setRangeFilter]    = useState<RangeFilter>("All");
    const [statusFilter,   setStatusFilter]   = useState<GrievanceStatus | "All">("All");
    const [priorityFilter, setPriorityFilter] = useState<GrievancePriority | "All">("All");
    const [typeFilter,     setTypeFilter]     = useState<GrievanceType | "All">("All");
    const [expandedId,     setExpandedId]     = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const json = await getGrievanceList();
            if (json.responseCode === 101) {
                setGrievances(json.data ?? []);
            } else {
                throw new Error(json.responseMessage || "Failed to load grievances");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to load grievances");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const stats = useMemo(() => ({
        total:      grievances.length,
        open:       grievances.filter((g) => g.Status === "Open").length,
        inProgress: grievances.filter((g) => g.Status === "In Progress").length,
        resolved:   grievances.filter((g) => g.Status === "Resolved" || g.Status === "Closed").length,
        critical:   grievances.filter((g) => g.Priority === "Critical").length,
    }), [grievances]);

    const ISSUE_TYPES: GrievanceType[] = [
        "Data Access Request", "Data Correction Request", "Data Deletion / Erasure",
        "Consent Withdrawal", "Data Breach Concern", "Unauthorised Processing",
        "Data Portability", "Other",
    ];

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return grievances
            .filter((g) => {
                if (s) {
                    const h = [
                        g.UserName, g.UserEmail, g.UserMobile, g.ConsentId,
                        g.IssueType, g.IssueDescription, g.FormName, String(g.Id),
                    ].join(" ").toLowerCase();
                    if (!h.includes(s)) return false;
                }
                if (statusFilter   !== "All" && g.Status    !== statusFilter)   return false;
                if (priorityFilter !== "All" && g.Priority  !== priorityFilter) return false;
                if (typeFilter     !== "All" && g.IssueType !== typeFilter)      return false;
                if (!withinRange(g.FiledOn, rangeFilter))                        return false;
                return true;
            })
            .sort((a, b) => {
                const pOrd: Record<GrievancePriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                if (pOrd[a.Priority] !== pOrd[b.Priority]) return pOrd[a.Priority] - pOrd[b.Priority];
                return new Date(b.FiledOn).getTime() - new Date(a.FiledOn).getTime();
            });
    }, [grievances, search, statusFilter, priorityFilter, typeFilter, rangeFilter]);

    const toggleExpand  = (id: number) => setExpandedId((p) => (p === id ? null : id));
    const handleResolved = (updated: Grievance) =>
        setGrievances((prev) => prev.map((g) => (g.Id === updated.Id ? updated : g)));

    return (
        <div className="app-container">
            {/* Header */}
            <div className="panel mb-3">
                <div className="panel-head p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                    <div>
                        <div className="h5 mb-1 d-flex align-items-center gap-2">
                            <i className="bi bi-exclamation-octagon text-warning" />Grievances
                        </div>
                        <div className="text-secondary small">
                            Manage Data Principal grievances under Chapter IV of the DPDP Act, 2023
                        </div>
                    </div>
                    <button className="btn btn-sm" style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", color: "var(--text-1)" }}
                        onClick={fetchData} disabled={loading}>
                        <i className="bi bi-arrow-clockwise me-1" />{loading ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-3">
                {[
                    { label: "Total Grievances", value: stats.total,      icon: "bi-collection",          color: "#4f6ef7" },
                    { label: "Open",              value: stats.open,       icon: "bi-circle",              color: "#5ac8fa" },
                    { label: "In Progress",       value: stats.inProgress, icon: "bi-arrow-repeat",        color: "#ffc107" },
                    { label: "Resolved",          value: stats.resolved,   icon: "bi-check-circle",        color: "#3dd68c" },
                    { label: "Critical",          value: stats.critical,   icon: "bi-exclamation-octagon", color: "#f86e7a" },
                ].map((s) => (
                    <div key={s.label} className="col-6 col-md-4 col-xl">
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

            {/* DPDP note */}
            <div className="mb-3 p-3" style={{ background: "rgba(255,193,7,0.06)", borderRadius: 10, border: "1px solid rgba(255,193,7,0.15)", fontSize: 13, color: "var(--text-1)" }}>
                <i className="bi bi-info-circle me-2 text-warning" />
                <strong>DPDP Act, 2023 — Section 13:</strong> Every Data Fiduciary must establish an accessible mechanism for Data Principals to file grievances. Unresolved grievances may be escalated to the Data Protection Board of India. Resolutions are <strong>emailed directly to the user</strong> when submitted.
            </div>

            {/* Filters */}
            <div className="panel mb-3">
                <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
                    <div className="input-group input-group-sm" style={{ maxWidth: 320, flex: "1 1 200px" }}>
                        <span className="input-group-text search"><i className="bi bi-search" /></span>
                        <input className="form-control search" placeholder="Search name, email, consent ID, issue..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        {search && <button className="btn btn-outline-secondary btn-sm" onClick={() => setSearch("")}><i className="bi bi-x" /></button>}
                    </div>
                    <select className="form-select form-select-sm search" style={{ maxWidth: 150 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                        <option value="All">All Status</option>
                        <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
                    </select>
                    <select className="form-select form-select-sm search" style={{ maxWidth: 150 }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
                        <option value="All">All Priority</option>
                        <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                    </select>
                    <select className="form-select form-select-sm search" style={{ maxWidth: 210 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
                        <option value="All">All Issue Types</option>
                        {ISSUE_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <select className="form-select form-select-sm search" style={{ maxWidth: 150 }} value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value as RangeFilter)}>
                        <option>All</option><option>Today</option><option>Last 7 days</option><option>Last 30 days</option>
                    </select>
                    <span className="ms-auto text-secondary small">
                        {filtered.length} grievance{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* List */}
            <div>
                {loading && (
                    <div className="text-center py-5 text-secondary">
                        <div className="spinner-border spinner-border-sm me-2" />Loading grievances...
                    </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && filtered.length === 0 && (
                    <div className="panel text-center py-5 text-secondary">
                        <i className="bi bi-check2-all d-block mb-2" style={{ fontSize: 36, opacity: 0.3 }} />
                        <div className="fw-semibold">No grievances found</div>
                        <div className="small mt-1">Try adjusting your filters</div>
                    </div>
                )}
                {!loading && filtered.map((g) => (
                    <GrievanceRow
                        key={g.Id}
                        g={g}
                        isExpanded={expandedId === g.Id}
                        onToggle={toggleExpand}
                        onResolved={handleResolved}
                    />
                ))}
            </div>

            {/* Pagination placeholder */}
            {!loading && filtered.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3 text-secondary small">
                    <span>Showing {filtered.length} of {grievances.length} grievances</span>
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--stroke)", color: "var(--text-1)" }} disabled><i className="bi bi-chevron-left" /></button>
                        <button className="btn btn-sm" style={{ background: "var(--soft)", border: "1px solid var(--brand)", color: "var(--brand)" }}>1</button>
                        <button className="btn btn-sm" style={{ background: "transparent", border: "1px solid var(--stroke)", color: "var(--text-1)" }} disabled><i className="bi bi-chevron-right" /></button>
                    </div>
                </div>
            )}
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default GrievancesPage;