import React, { useMemo } from "react";
import { useProject } from "../Context/projectContext";

type StatCard = {
    label: string;
    value: number | string;
    note: React.ReactNode;
    iconClass: string;
};

type ActivityBadge = "New" | "Edit" | "User" | "Action";
type ActivityRow = {
    badge: ActivityBadge;
    text: string;
    user: string;
    form: string;
    time: string;
};

const badgeClass = (b: ActivityBadge) => {
    if (b === "New") return "badge text-bg-success rounded-pill me-2";
    if (b === "Edit") return "badge text-bg-warning rounded-pill me-2";
    if (b === "User") return "badge text-bg-secondary rounded-pill me-2";
    return "badge text-bg-primary rounded-pill me-2";
};

 

const Dashboard: React.FC = () => {
    const {
        dashboard,
        dashboardLoading,
        dashboardError, 
    } = useProject();

    const stats: StatCard[] = [
        {
            label: "Total Users",
            value: dashboard?.totalUsers ?? 0,
            note: <>All registered users</>,
            iconClass: "bi bi-people fs-5",
        },
        {
            label: "Total Forms",
            value: dashboard?.totalForms ?? 0,
            note: <>All available forms</>,
            iconClass: "bi bi-ui-checks-grid fs-5",
        },
        {
            label: "Total Form Responses",
            value: dashboard?.totalFormResponse ?? 0,
            note: <>Responses received</>,
            iconClass: "bi bi-chat-square-text fs-5",
        },
        {
            label: "Consent Remove Requests",
            value: dashboard?.totalConsentRemoveRequest ?? 0,
            note: <>All consent removal requests</>,
            iconClass: "bi bi-file-earmark-minus fs-5",
        },
        {
            label: "Pending Requests",
            value: dashboard?.totalPendingConsentRemoveRequest ?? 0,
            note: <>Awaiting action</>,
            iconClass: "bi bi-hourglass-split fs-5",
        },
        {
            label: "Action Taken",
            value: dashboard?.totalConsentRequestActionTaken ?? 0,
            note: <>Processed requests</>,
            iconClass: "bi bi-check2-square fs-5",
        },
        {
            label: "Approved Actions",
            value: dashboard?.totalApprovedActionTaken ?? 0,
            note: <>Approved consent actions</>,
            iconClass: "bi bi-check-circle fs-5",
        },
        {
            label: "Rejected Actions",
            value: dashboard?.totalRejectedActionTaken ?? 0,
            note: <>Rejected consent actions</>,
            iconClass: "bi bi-x-circle fs-5",
        },
    ];

    const rows: ActivityRow[] = useMemo(() => {
        if (!dashboard?.activityLogs?.length) {
            return [
                {
                    badge: "Action",
                    text: "No recent activity available",
                    user: "—",
                    form: "—",
                    time: "—",
                },
            ];
        }

        return dashboard.activityLogs.map((item: any, index: number) => ({
            badge: "Action",
            text:
                item?.text ||
                item?.activity ||
                item?.message ||
                `Activity ${index + 1}`,
            user: item?.user || item?.userName || item?.email || "—",
            form: item?.form || item?.formName || "—",
            time: item?.time || item?.createdOn || item?.date || "—",
        }));
    }, [dashboard]);

    const publishedCount = dashboard?.totalForms ?? 0;
    const draftCount = dashboard?.totalPendingConsentRemoveRequest ?? 0;
    const archivedCount = dashboard?.totalRejectedActionTaken ?? 0;

    const totalStatus = publishedCount + draftCount + archivedCount;

    const pct = (n: number) => {
        if (totalStatus <= 0) return 0;
        return Math.round((n / totalStatus) * 100);
    };

    const publishedPct = useMemo(() => pct(publishedCount), [publishedCount, totalStatus]);
    const draftPct = useMemo(() => pct(draftCount), [draftCount, totalStatus]);
    const archivedPct = useMemo(() => pct(archivedCount), [archivedCount, totalStatus]);

    return (
        <div className="container-fluid app-shell">
            <div className="row g-0">
                {/* Header */}
                <div className="panel mb-3">
                    <div className="panel-head p-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
                        <div>
                            <div className="h5 mb-1">Admin Dashboard</div>
                            <div className="text-secondary small">
                                Overview of your platform metrics
                            </div>
                        </div>


                    </div>
                </div>

                {/* Error */}
                {dashboardError && (
                    <div className="col-12 mb-3">
                        <div className="alert alert-danger mb-0">{dashboardError}</div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="row g-3 mb-3">
                    {stats.map((s) => (
                        <div key={s.label} className="col-12 col-md-6 col-xl-3">
                            <div className="stat-card h-100">
                                <div className="d-flex align-items-start justify-content-between">
                                    <div>
                                        <div className="text-secondary small  ">{s.label}</div>
                                        <div className="stat-value">
                                            {dashboardLoading ? "..." : s.value}
                                        </div>
                                        <div className="mini-note mt-1">{s.note}</div>
                                    </div>
                                    <div className="stat-icon">
                                        <i className={s.iconClass} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Panels */}
                <div className="row g-3">
                    {/* Recent Activity */}
                    <div className="col-12 col-xl-7">
                        <div className="panel h-100">
                            <div className="panel-head p-3 d-flex align-items-center justify-content-between">
                                <div className="fw-bold">Recent Activity</div>
                                <span className="badge badge-soft rounded-pill">Live</span>
                            </div>

                            <div className="p-3">
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: 220 }}>Event</th>
                                                <th>User</th>
                                                <th>Form</th>
                                                <th className="text-end">Time</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {rows.map((r, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <span className={badgeClass(r.badge)}>{r.badge}</span>
                                                        {r.text}
                                                    </td>
                                                    <td className="text-secondary">{r.user}</td>
                                                    <td className={r.form === "—" ? "text-secondary" : "fw-semibold"}>
                                                        {r.form}
                                                    </td>
                                                    <td className="text-end text-secondary">{r.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="col-12 col-xl-5">
                        <div className="panel h-100">
                            <div className="panel-head p-3 d-flex align-items-center justify-content-between">
                                <div className="fw-bold">Status Breakdown</div>
                                <span className="badge badge-soft rounded-pill">Summary</span>
                            </div>

                            <div className="p-3">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="text-secondary">Total Forms</div>
                                    <div className="fw-semibold">{publishedCount}</div>
                                </div>
                                <div className="progress mb-3" role="progressbar" aria-label="Total Forms percent">
                                    <div className="progress-bar" style={{ width: `${publishedPct}%` }} />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="text-secondary">Pending Requests</div>
                                    <div className="fw-semibold">{draftCount}</div>
                                </div>
                                <div className="progress mb-3" role="progressbar" aria-label="Pending Requests percent">
                                    <div className="progress-bar" style={{ width: `${draftPct}%` }} />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="text-secondary">Rejected Actions</div>
                                    <div className="fw-semibold">{archivedCount}</div>
                                </div>
                                <div className="progress" role="progressbar" aria-label="Rejected Actions percent">
                                    <div className="progress-bar" style={{ width: `${archivedPct}%` }} />
                                </div>

                                <div className="mini-note mt-3">
                                    This section is using dashboard API summary values.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extra Info Cards same design */}
                <div className="row g-3 mt-1">
                    <div className="col-12 col-md-6 col-xl-4">
                        <div className="stat-card h-100">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <div className="text-secondary small font700">Role ID</div>
                                    <div className="stat-value">{dashboard?.roleId ?? 0}</div>
                                    <div className="mini-note mt-1">Current admin role</div>
                                </div>
                                <div className="stat-icon">
                                    <i className="bi bi-person-badge fs-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <div className="stat-card h-100">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <div className="text-secondary small font700">Approval Rate</div>
                                    <div className="stat-value">
                                        {dashboard && dashboard.totalConsentRequestActionTaken > 0
                                            ? `${Math.round(
                                                (dashboard.totalApprovedActionTaken /
                                                    dashboard.totalConsentRequestActionTaken) *
                                                100
                                            )}%`
                                            : "0%"}
                                    </div>
                                    <div className="mini-note mt-1">Approved out of total actions</div>
                                </div>
                                <div className="stat-icon">
                                    <i className="bi bi-graph-up-arrow fs-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <div className="stat-card h-100">
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <div className="text-secondary small font700">Rejection Rate</div>
                                    <div className="stat-value">
                                        {dashboard && dashboard.totalConsentRequestActionTaken > 0
                                            ? `${Math.round(
                                                (dashboard.totalRejectedActionTaken /
                                                    dashboard.totalConsentRequestActionTaken) *
                                                100
                                            )}%`
                                            : "0%"}
                                    </div>
                                    <div className="mini-note mt-1">Rejected out of total actions</div>
                                </div>
                                <div className="stat-icon">
                                    <i className="bi bi-graph-down-arrow fs-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;