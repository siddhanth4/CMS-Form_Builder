import React, { useState, useEffect } from "react";
import { getOrganizations } from "../Api/Organization/getOrganizationList";

interface ClusterData {
    id: number;
    name: string;
    status: "HEALTHY" | "CRITICAL";
    storageUsed: number;
    storageTotal: number;
    consents: string;
    uptime: string;
    region: string;
    icon: string;
}

interface SingleClusterCardProps {
    orgCode: number; // Organization code to filter for
}

const SingleClusterCard: React.FC<SingleClusterCardProps> = ({ orgCode }) => {
    const [cluster, setCluster] = useState<ClusterData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrganizationCluster = async () => {
        try {
            setLoading(true);
            setError("");
            
            const { rows } = await getOrganizations({
                status: "Y",
                PageNumber: 1,
                PageSize: 100, // Get more to ensure we find the target org
                SortOrder: "DESC",
            });

            // Find the specific organization by orgCode
            const targetOrg = rows.find(org => org.Id === orgCode || org.OrgCode === orgCode);
            
            if (targetOrg) {
                const clusterData: ClusterData = {
                    id: targetOrg.Id,
                    name: targetOrg.OrgName || `Organization ${targetOrg.Id}`,
                    status: targetOrg.Status === "Y" ? "HEALTHY" : "CRITICAL",
                    storageUsed: (targetOrg.Id % 5) + 1.5, // Different storage per organization
                    storageTotal: 10,
                    consents: "—",
                    uptime: "99.9%",
                    region: `${targetOrg.City || "Unknown"}, ${targetOrg.State || "Unknown"}`,
                    icon: "bi-building",
                };
                setCluster(clusterData);
            } else {
                setError("Organization not found");
                setCluster(null);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to fetch organization cluster");
            setCluster(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orgCode) {
            fetchOrganizationCluster();
        }
    }, [orgCode]);

    if (loading) {
        return (
            <div className="panel">
                <div className="p-3 text-center text-secondary small">
                    <i className="bi bi-arrow-repeat spin me-2"></i>
                    Loading cluster...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="panel">
                <div className="alert alert-danger mb-0">{error}</div>
            </div>
        );
    }

    if (!cluster) {
        return (
            <div className="panel">
                <div className="p-4 text-center text-secondary small">
                    No cluster data available.
                </div>
            </div>
        );
    }

    return (
        <div className="panel">
            <div className="panel-head p-3 d-flex justify-content-between align-items-center">

                <div className="d-flex align-items-center gap-2 fw-bold fs-5">

                    <i className={`bi ${cluster.icon}`} />
                    <div className="h5 mt-2 fw-bold">Database Cluster :</div>
                    {cluster.name}
                </div>
                
                <span className={`badge rounded-pill ${cluster.status === "HEALTHY" ? "text-bg-success" : "text-bg-warning"}`}>
                    {cluster.status}
                </span>
            </div>
            <div className="p-3">
                <div className="progress mb-3">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${(cluster.storageUsed / cluster.storageTotal) * 100}%` }} 
                    />
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="panel p-3 h-100">
                            <div className="text-secondary small">Storage</div>
                            <div className="fw-bold fs-4">{cluster.storageUsed.toFixed(1)} / {cluster.storageTotal} GB</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="panel p-3 h-100">
                            <div className="text-secondary small">Consents</div>
                            <div className="fw-bold fs-4">{cluster.consents}</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="panel p-3 h-100">
                            <div className="text-secondary small">Uptime</div>
                            <div className="fw-bold fs-4">{cluster.uptime}</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <div className="panel p-3 h-100">
                            <div className="text-secondary small">Region</div>
                            <div className="fw-bold fs-4">{cluster.region}</div>
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm">View Logs</button>
                    <button className="btn btn-outline-secondary btn-sm">Expand Storage</button>
                    <button className="btn btn-outline-secondary btn-sm">Force Backup</button>
                </div>
            </div>
        </div>
    );
};

export default SingleClusterCard;
