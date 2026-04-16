// import React, { useMemo } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { useOrganizationAuth } from "../Context/organizationContext";
// import { useProject } from "../Context/projectContext";

// type Props = {
//     onClose: () => void;
//     onNav?: () => void;
// };

// const menuIconClass = (icon: string) => {
//     switch ((icon || "").toLowerCase()) {
//         case "dashboard":
//             return "bi-speedometer2";
//         case "admin_panel":
//             return "bi-person";
//         case "form":
//             return "bi-ui-checks-grid";
//         case "list":
//             return "bi-list-check";
//         case "organization":
//             return "bi-building";
//         default:
//             return "bi-circle";
//     }
// };

// const Sidebar: React.FC<Props> = ({ onClose, onNav }) => {
//     const location = useLocation();

//     const {
//         logout,
//         isAuthenticated: isOrgAuthenticated,
//     } = useOrganizationAuth();

//     const {
//         logoutAdmin,
//         isAdminAuthenticated,
//         menus, 
//         adminMenus,
//         adminMenusLoading,
//     } = useProject();

//     const pathname = location.pathname.toLowerCase();

//     const isAdminRoute =
//     pathname.startsWith("/admin") ||
//     pathname.startsWith("/builder") ||
//     pathname.startsWith("/forms") ||
//     pathname.startsWith("/submissions") ||
//     pathname.startsWith("/withdrawRequest");
//     const isOrgRoute = pathname.startsWith("/organization");

//     const sidebarMode: "admin" | "organization" | "none" = useMemo(() => {
//         // route should always win
//         if (isAdminRoute) return "admin";
//         if (isOrgRoute) return "organization";

//         // fallback only if exactly one auth is active
//         if (isAdminAuthenticated && !isOrgAuthenticated) return "admin";
//         if (isOrgAuthenticated && !isAdminAuthenticated) return "organization";

//         return "none";
//     }, [isAdminRoute, isOrgRoute, isAdminAuthenticated, isOrgAuthenticated]);

//     // const allowedPageIds = useMemo(() => {
//     //     return new Set((adminMenus || []).map((x) => Number(x.PageId)));
//     // }, [adminMenus]);

//     const visibleAdminMenus = useMemo(() => {
//     return [...(adminMenus || [])].sort(
//         (a, b) => Number(a.SortOrder) - Number(b.SortOrder)
//     );
// }, [adminMenus]);

// console.log("menus:", menus);
// console.log("adminMenus:", adminMenus);
// console.log("visibleAdminMenus:", visibleAdminMenus);
// console.log("sidebarMode:", sidebarMode);

// const loadingAdminMenu = adminMenusLoading;

//     return (
//         <aside className="sidebar p-3">
//             <button
//                 className="btn btn-outline-secondary btn-sm d-lg-none mb-3"
//                 onClick={onClose}
//                 type="button"
//             >
//                 <i className="bi bi-x-lg" />
//             </button>

//             <div className="d-flex align-items-center gap-3 p-2 panel">
//                 <div className="brand-badge">FF</div>
//                 <div>
//                     <div className="fw-bold">NJ Softtech</div>
//                     <div className="text-secondary small">
//                         {sidebarMode === "admin"
//                             ? "Admin Panel"
//                             : sidebarMode === "organization"
//                                 ? "Organization"
//                                 : ""}
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-3 nav nav-pills flex-column gap-2">
//                 {sidebarMode === "organization" && (
//                     <>
//                         <NavLink
//                             to="/organization/OrganizationDashboard"
//                             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//                             onClick={onNav}
//                         >
//                             <i className="bi bi-speedometer2 me-2" />
//                             Dashboard
//                         </NavLink>

//                         <NavLink
//                             to="/organization/addOrganization"
//                             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//                             onClick={onNav}
//                         >
//                             <i className="bi bi-building me-2" />
//                             Organization
//                         </NavLink>

//                         <button
//                             className="btn btn-danger mt-2"
//                             onClick={logout}
//                             type="button"
//                         >
//                             Logout
//                         </button>
//                     </>
//                 )}

//                  {sidebarMode === "admin" && (
//     <>
//         {loadingAdminMenu ? (
//             <div className="text-secondary small px-2 py-1">
//                 Loading menu...
//             </div>
//         ) : visibleAdminMenus.length === 0 ? (
//             <div className="text-danger small px-2 py-1">
//                 No menu found
//             </div>
//         ) : (
//             visibleAdminMenus.map((m) => (
//                 <NavLink
//                     key={m.Id}
//                     to={m.Route}
//                     className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//                     onClick={onNav}
//                     id={m.PageKey}
//                 >
//                     <i className={`bi ${menuIconClass(m.Icon)} me-2`} />
//                     {m.PageName}
//                 </NavLink>
//             ))
//         )}  
//         <NavLink
//     to="/admin/privacyNotices"
//     className={({ isActive }) =>
//         `nav-link ${isActive ? "active" : ""}`
//     }
//     onClick={onNav}
// >
//     <i className="bi bi-file-earmark-lock2 me-2" />
//     Privacy Notices
// </NavLink>
//                         <NavLink to="/admin/grievances" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                             <i className="bi bi-exclamation-octagon me-2" /> Grievances
//                         </NavLink>
//         <button
//             className="btn btn-danger mt-2"
//             onClick={logoutAdmin}
//             type="button"
//         >
//             Logout
//         </button>
//     </>
// )}


//             </div>
//         </aside>

        
//     );

    
// };

// export default Sidebar;

import React, { useMemo, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useOrganizationAuth } from "../Context/organizationContext";
import { useProject } from "../Context/projectContext";

type Props = {
    onClose: () => void;
    onNav?: () => void;
};

const Sidebar: React.FC<Props> = ({ onClose, onNav }) => {
    const location = useLocation();

    const {
        logout,
        isAuthenticated: isOrgAuthenticated,
    } = useOrganizationAuth();

    const {
        logoutAdmin,
        isAdminAuthenticated,
        adminMenus,
        adminMenusLoading,
        refreshAdminMenus,
    } = useProject();

    const pathname = location.pathname.toLowerCase();

    const isAdminRoute = pathname.startsWith("/admin");
    const isOrgRoute = pathname.startsWith("/organization");

    const sidebarMode: "admin" | "organization" | "none" = useMemo(() => {
        if (isAdminRoute) return "admin";
        if (isOrgRoute) return "organization";
        if (isAdminAuthenticated && !isOrgAuthenticated) return "admin";
        if (isOrgAuthenticated && !isAdminAuthenticated) return "organization";
        return "none";
    }, [isAdminRoute, isOrgRoute, isAdminAuthenticated, isOrgAuthenticated]);

    // Filter and sort admin menus based on permissions
    const visibleAdminMenus = useMemo(() => {
        if (!adminMenus || adminMenus.length === 0) return [];
        
        // Debug: Log what adminMenus contains
        console.log("AdminMenus from API:", adminMenus);
        console.log("Privacy Notice in adminMenus:", adminMenus.find(m => 
            m.Id === 9991 || 
            m.PageKey === "privacy_notices" ||
            m.PageName?.toLowerCase().includes("privacy")
        ));
        console.log("Grievances in adminMenus:", adminMenus.find(m => 
            m.Id === 9992 || 
            m.PageKey === "grievances" ||
            m.PageName?.toLowerCase().includes("grievance")
        ));
        
        let menuPermissions = [...adminMenus].sort((a, b) => Number(a.SortOrder) - Number(b.SortOrder));
        
        // Add Privacy Notice if not present in adminMenus (for main admin)
        const hasPrivacyNotice = menuPermissions.some(m => 
            m.Id === 9991 || 
            m.PageKey === "privacy_notices" ||
            m.PageName?.toLowerCase().includes("privacy") ||
            m.Route === "/admin/privacyNotices"
        );

        if (!hasPrivacyNotice) {
            menuPermissions.push({
                Id: 9991,
                PageId: 9991,
                PageKey: "privacy_notices",
                Icon: "bi-shield-lock",
                PageName: "Privacy Notice",
                Route: "/admin/privacyNotices",
                SortOrder: 999,
                Status: "Y" as const,
                TTime: new Date().toISOString(),
            });
        }

        // Add Grievances if not present in adminMenus (for main admin)
        const hasGrievances = menuPermissions.some(m => 
            m.Id === 9992 || 
            m.PageKey === "grievances" ||
            m.PageName?.toLowerCase().includes("grievance") ||
            m.Route === "/admin/grievances"
        );

        if (!hasGrievances) {
            menuPermissions.push({
                Id: 9992,
                PageId: 9992,
                PageKey: "grievances",
                Icon: "bi-exclamation-triangle",
                PageName: "Grievances",
                Route: "/admin/grievances",
                SortOrder: 1000,
                Status: "Y" as const,
                TTime: new Date().toISOString(),
            });
        }
        
        console.log("Final menu permissions:", menuPermissions);
        return menuPermissions;
    }, [adminMenus]);

    // Map icon names to Bootstrap icon classes
    const menuIconClass = (icon: string, pageName?: string) => {
        const iconLower = (icon || "").toLowerCase();
        const nameLower = (pageName || "").toLowerCase();
        
        // More specific icon mapping based on page name and icon
        if (nameLower.includes("dashboard") || iconLower === "dashboard" || iconLower === "speedometer2") {
            return "bi-speedometer2";
        }
        if (nameLower.includes("admin") || nameLower.includes("role") || nameLower.includes("user") || iconLower === "people") {
            return "bi-people";
        }
        if (nameLower.includes("form") && nameLower.includes("list") || iconLower === "list-check") {
            return "bi-list-ul";
        }
        if (nameLower.includes("form") && nameLower.includes("response") || iconLower === "envelope-paper") {
            return "bi-envelope";
        }
        if (nameLower.includes("consent") && nameLower.includes("withdraw") || iconLower === "shield-x") {
            return "bi-shield-exclamation";
        }
        if (nameLower.includes("privacy") || iconLower === "file-earmark-lock2") {
            return "bi-shield-lock";
        }
        if (nameLower.includes("grievance") || iconLower === "exclamation-octagon") {
            return "bi-exclamation-triangle";
        }
        if (nameLower.includes("add") && nameLower.includes("form") || iconLower === "ui-checks-grid") {
            return "bi-plus-square";
        }
        if (nameLower.includes("organization") || iconLower === "building") {
            return "bi-building";
        }
        if (nameLower.includes("database") || iconLower === "database") {
            return "bi-database";
        }
        if (nameLower.includes("logs") || iconLower === "list") {
            return "bi-journal-text";
        }
        if (nameLower.includes("billing") || iconLower === "credit-card") {
            return "bi-credit-card";
        }
        
        // Fallback to icon-based mapping
        switch (iconLower) {
            case "dashboard":
                return "bi-speedometer2";
            case "people":
                return "bi-people";
            case "ui-checks-grid":
                return "bi-plus-square";
            case "list-check":
                return "bi-list-ul";
            case "envelope-paper":
                return "bi-envelope";
            case "shield-x":
                return "bi-shield-exclamation";
            case "file-earmark-lock2":
                return "bi-shield-lock";
            case "exclamation-octagon":
                return "bi-exclamation-triangle";
            case "building":
                return "bi-building";
            case "database":
                return "bi-database";
            case "list":
                return "bi-journal-text";
            case "credit-card":
                return "bi-credit-card";
            default:
                return "bi-circle";
        }
    };

    // Load admin menus when admin user changes
    useEffect(() => {
        if (isAdminAuthenticated) {
            refreshAdminMenus();
        }
    }, [isAdminAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <aside className="sidebar p-3">
            <button
                className="btn btn-outline-secondary btn-sm d-lg-none mb-3"
                onClick={onClose}
                type="button"
            >
                <i className="bi bi-x-lg" />
            </button>

            <div className="d-flex align-items-center gap-3 p-2 panel">
                <div className="brand-badge">FF</div>
                <div>
                    <div className="fw-bold">NJ Softtech</div>
                    <div className="text-secondary small">
                        {sidebarMode === "admin"
                            ? "Admin Panel"
                            : sidebarMode === "organization"
                                ? "Organization"
                                : ""}
                    </div>
                </div>
            </div>

            <div className="mt-3 nav nav-pills flex-column gap-2">
                {sidebarMode === "organization" && (
                    <>
                        <NavLink to="/organization/OrganizationDashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                            <i className="bi bi-speedometer2 me-2" /> Dashboard
                        </NavLink>
                        <NavLink to="/organization/addOrganization" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                            <i className="bi bi-building me-2" /> Organization
                        </NavLink>
                        <NavLink to="/organization/DbCluster" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                            <i className="bi bi-database me-2" /> DB Cluster
                        </NavLink>
                        <NavLink to="/organization/Logs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                            <i className="bi bi-list me-2" /> Logs
                        </NavLink>
                        <NavLink to="/organization/Billing" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                            <i className="bi bi-credit-card me-2" /> Billing
                        </NavLink>
                        <button className="btn btn-danger mt-2" onClick={logout} type="button">
                            Logout
                        </button>

                    </>
                )}

                {sidebarMode === "admin" && (
                    <>
                        {adminMenusLoading ? (
                            <div className="text-secondary small px-2 py-1">
                                Loading menu...
                            </div>
                        ) : visibleAdminMenus.length === 0 ? (
                            <div className="text-danger small px-2 py-1">
                                No menu permissions found
                            </div>
                        ) : (
                            visibleAdminMenus.map((m: any) => (
                                <NavLink
                                    key={m.Id}
                                    to={m.Route}
                                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                    onClick={onNav}
                                    id={m.PageKey}
                                >
                                    <i className={`bi ${menuIconClass(m.Icon, m.PageName)} me-2`} />
                                    {m.PageName}
                                </NavLink>
                            ))
                        )}
                        
                        <button className="btn btn-danger mt-4" onClick={logoutAdmin} type="button">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;