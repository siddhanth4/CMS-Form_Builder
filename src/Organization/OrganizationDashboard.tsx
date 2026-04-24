import React, { useMemo, useState, useEffect } from "react";
import { getAdminDashboard } from "../Api/Admin/getDashboardDetails";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


type StatCard = {
    label: string;
    value: number | string;
    note: React.ReactNode;
    iconClass: string;
};

type Props = {
    totalUsers?: number;
    totalForms?: number;
    totalResponses?: number;
    totalPublished?: number;
    onRefresh?: () => void;

    // Status Breakdown (optional)
    publishedCount?: number;
    draftCount?: number;
    archivedCount?: number;
};

export default function Dashboard({
    totalUsers: propTotalUsers = 0,
    totalForms: propTotalForms = 0,
    totalResponses: propTotalResponses = 0,
    totalPublished: propTotalPublished = 0,

    publishedCount = 40,
    draftCount = 15,
    archivedCount = 30,
}: Props) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAdminDashboard();
            setDashboardData(data);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch dashboard data");
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Use API data if available, otherwise use props
    const totalUsers = dashboardData?.totalUsers ?? propTotalUsers;
    const totalForms = dashboardData?.totalForms ?? propTotalForms;
    const totalResponses = dashboardData?.totalFormResponse ?? propTotalResponses;
    const totalPublished = propTotalPublished; // Not available in API, use prop

    // Chart data
    const chartData = [
        { name: "Total Users", value: totalUsers },
        { name: "Total Forms", value: totalForms },
        { name: "Total Form Responses", value: totalResponses },
        { name: "Total Published Forms", value: totalPublished },
    ];

    const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6"];
    const stats: StatCard[] = [
        {
            label: "Total Users",
            value: totalUsers,
            note: (
                <>
                    <i className="bi bi-arrow-up-right" /> +12 this month
                </>
            ),
            iconClass: "bi bi-people fs-5",
        },
        {
            label: "Total Forms",
            value: totalForms,
            note: (
                <>
                    <i className="bi bi-plus-circle" /> +2 created
                </>
            ),
            iconClass: "bi bi-ui-checks-grid fs-5",
        },
        {
            label: "Total Form Responses",
            value: totalResponses,
            note: (
                <>
                    <i className="bi bi-inbox" /> +46 today
                </>
            ),
            iconClass: "bi bi-chat-square-text fs-5",
        },
        {
            label: "Total Published Forms",
            value: totalPublished,
            note: (
                <>
                    <i className="bi bi-broadcast" /> Active
                </>
            ),
            iconClass: "bi bi-rocket-takeoff fs-5",
        },
    ];

    const totalStatus = publishedCount + draftCount + archivedCount;

    const pct = (n: number) => {
        if (totalStatus <= 0) return 0;
        return Math.round((n / totalStatus) * 100);
    };

    const publishedPct = useMemo(() => pct(publishedCount), [publishedCount, totalStatus]);
    const draftPct = useMemo(() => pct(draftCount), [draftCount, totalStatus]);
    const archivedPct = useMemo(() => pct(archivedCount), [archivedCount, totalStatus]);

    return (
        <>
            <div className="container-fluid app-shell">
                <div className="row g-0">
                    {/* Topbar */}
                    <div className="panel mb-3">
                        <div className="panel-head p-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
                            <div>
                                <div className="h5 mb-1">Organization Dashboard</div>
                                <div className="text-secondary small">Overview of your platform metrics</div>
                            </div>


                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="col-12 mb-3">
                            <div className="alert alert-danger mb-0">{error}</div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="row g-3 mb-3">
                        {stats.map((s) => (
                            <div key={s.label} className="col-12 col-md-6 col-xl-3">
                                <div className="stat-card">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div>
                                            <div className="text-secondary small font700">{s.label}</div>
                                            <div className="stat-value">{loading ? "..." : s.value}</div>
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

                    {/* Two panels row */}
                    <div className="row g-3">
                        {/* Analytics Overview */}
                        <div className="col-12 col-xl-6">
                            <div className="panel h-100 p-3">
                                <div className="fw-bold mb-3">Analytics Overview</div>

                                <div style={{ height: 260 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={4}
                                            >
                                                {chartData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="mt-3">
                                    {chartData.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <span style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    background: COLORS[i]
                                                }} />
                                                <span className="text-secondary">{item.name}</span>
                                            </div>
                                            <span className="fw-semibold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="col-12 col-xl-6">
                            <div className="panel h-100 p-3">
                                <div className="panel-head p-3 d-flex align-items-center justify-content-between" style={{ padding: "0 0 1rem 0" }}>
                                    <div className="fw-bold">Status Breakdown</div>
                                    <span className="badge badge-soft rounded-pill">Forms</span>
                                </div>

                                <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="text-secondary">Published</div>
                                            <div className="fw-semibold">
                                                <span>{publishedCount}</span>
                                            </div>
                                        </div>
                                        <div className="progress" role="progressbar" aria-label="Published percent">
                                            <div className="progress-bar" style={{ width: `${publishedPct}%` }} />
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="text-secondary">Draft</div>
                                            <div className="fw-semibold">
                                                <span>{draftCount}</span>
                                            </div>
                                        </div>
                                        <div className="progress" role="progressbar" aria-label="Draft percent">
                                            <div className="progress-bar" style={{ width: `${draftPct}%` }} />
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="text-secondary">Archived</div>
                                            <div className="fw-semibold">
                                                <span>{archivedCount}</span>
                                            </div>
                                        </div>
                                        <div className="progress" role="progressbar" aria-label="Archived percent">
                                            <div className="progress-bar" style={{ width: `${archivedPct}%` }} />
                                        </div>
                                    </div>

                                    <div className="mini-note mt-3">
                                        Connect these numbers to your API response (forms summary).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
