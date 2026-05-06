// import React, { useEffect, useMemo, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { useOrganizationAuth } from "../Context/organizationContext";
// import { useProject } from "../Context/projectContext";
// import { getAdminMenus } from "../Api/Admin/getAdminMenuList";

// type Props = {
//     onClose: () => void;
//     onNav?: () => void;
// };

// const Sidebar: React.FC<Props> = ({ onClose, onNav }) => {
//     const location = useLocation();

//     const { logout, isAuthenticated: isOrgAuthenticated } = useOrganizationAuth();
//     const { logoutAdmin, isAdminAuthenticated, admin, roles } = useProject();

//     const pathname = location.pathname.toLowerCase();
//     const isAdminRoute = pathname.startsWith("/admin");
//     const isOrgRoute = pathname.startsWith("/organization");

//     const sidebarMode: "admin" | "organization" | "none" = useMemo(() => {
//         if (isAdminRoute) return "admin";
//         if (isOrgRoute) return "organization";
//         if (isAdminAuthenticated && !isOrgAuthenticated) return "admin";
//         if (isOrgAuthenticated && !isAdminAuthenticated) return "organization";
//         return "none";
//     }, [isAdminRoute, isOrgRoute, isAdminAuthenticated, isOrgAuthenticated]);

//     // 🔥 STATE: Stores the STRICT list of permissions the currently logged-in Admin is allowed to see
//     const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);
//     const [menusLoaded, setMenusLoaded] = useState(false);

//     // FETCH ALLOWED MENUS ON LOAD
//     useEffect(() => {
//         if (sidebarMode === "admin" && admin?.adCode) {
//             getAdminMenus({ adCode: admin.adCode })
//                 .then(menus => {
//                     // 🔥 EXTREMELY STRICT FILTER: Only allow menus that the backend explicitly approves.
//                     // If the backend returns CanView: "N", it is stripped out immediately.
//                     const activeMenus = menus.filter((m: any) => m.CanView !== "N" && m.canView !== "N");

//                     // Extract all possible identifiers (Routes, Keys, Names, IDs) to ensure we match correctly
//                     const routes = activeMenus
//                         .map(m => [m.Route?.toLowerCase(), m.PageKey?.toLowerCase(), m.PageName?.toLowerCase(), String(m.PageId)])
//                         .flat()
//                         .filter(Boolean) as string[];
                    
//                     setAllowedRoutes(routes);
//                     setMenusLoaded(true);
//                 })
//                 .catch(err => {
//                     console.error("Failed to load sidebar menus", err);
//                     setMenusLoaded(true); 
//                 });
//         }
//     }, [sidebarMode, admin?.adCode]);

//     // 🔥 STRICT CHECKER: Only returns true if the menu is EXPLICITLY in the allowed list from the DB
//     const hasAccess = (...keywords: string[]) => {
//         // If menus haven't loaded from the DB yet, hide everything to prevent unauthorized flashing
//         if (!menusLoaded) return false; 

//         return allowedRoutes.some(allowed => 
//             keywords.some(kw => allowed.includes(kw.toLowerCase()))
//         );
//     };

//     // Failsafe for custom injected pages (Privacy Notice & Grievance)
//     const hasCustomAccess = (localId: number) => {
//         if (!admin?.adCode) return false;
//         return localStorage.getItem(`FRONTEND_PERM_${localId}_${admin.adCode}`) === "Y";
//     };

//     return (
//         <aside className="sidebar p-3">
//             <button className="btn btn-outline-secondary btn-sm d-lg-none mb-3" onClick={onClose} type="button">
//                 <i className="bi bi-x-lg" />
//             </button>

//             <div className="d-flex align-items-center gap-3 p-2 panel mb-3">
//                 <div className="brand-badge">FF</div>
//                 <div>
//                     <div className="fw-bold">NJ Softtech</div>
//                     <div className="text-secondary small">
//                         {sidebarMode === "admin" ? "Admin Panel" : sidebarMode === "organization" ? "Organization" : ""}
//                     </div>
//                 </div>
//             </div>

//             <div className="nav nav-pills flex-column gap-2">
                
//                 {/* ── SERVICE PROVIDER PORTAL LINKS ── */}
//                 {sidebarMode === "organization" && (
//                     <>
//                         <NavLink to="/organization/OrganizationDashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                             <i className="bi bi-speedometer2 me-2" /> Dashboard
//                         </NavLink>
//                         <NavLink to="/organization/addOrganization" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                             <i className="bi bi-building me-2" /> Organization
//                         </NavLink>
//                         <NavLink to="/organization/DbCluster" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                             <i className="bi bi-database me-2" /> DB Cluster
//                         </NavLink>
//                         <NavLink to="/organization/Logs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                             <i className="bi bi-list me-2" /> Logs
//                         </NavLink>
//                         <NavLink to="/organization/Billing" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                             <i className="bi bi-credit-card me-2" /> Billing
//                         </NavLink>
//                         <button className="btn btn-danger mt-4" onClick={logout} type="button">
//                             Logout
//                         </button>
//                     </>
//                 )}

//                 {/* ── ADMIN PANEL LINKS (Protected by Strict Logic) ── */}
//                 {sidebarMode === "admin" && (
//                     <>
//                         {/* Show loading spinner while securely fetching permissions */}
//                         {!menusLoaded && (
//                             <div className="text-center py-4">
//                                 <div className="spinner-border spinner-border-sm text-secondary" />
//                             </div>
//                         )}

//                         {/* 1. Dashboard */}
//                         {hasAccess("dashboard") && (
//                             <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-speedometer2 me-2" /> Dashboard
//                             </NavLink>
//                         )}
                        
//                         {/* 2. Role List */}
//                         {hasAccess("addadmin", "role list", "user list") && (
//                             <NavLink to="/admin/addAdmin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-people me-2" /> Role List
//                             </NavLink>
//                         )}
                        
//                         {/* 3. Privacy Notices */}
//                         {(hasAccess("privacy", "privacynotice") || hasCustomAccess(998)) && (
//                             <NavLink to="/admin/privacyNotices" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-file-earmark-lock2 me-2" /> Privacy Notices
//                             </NavLink>
//                         )}

//                         {/* 4. Add New Form */}
//                         {hasAccess("builder", "new form") && (
//                             <NavLink to="/admin/builder" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-ui-checks-grid me-2" /> Add New Form
//                             </NavLink>
//                         )}
                        
//                         {/* 5. Form List */}
//                         {hasAccess("forms", "form list") && (
//                             <NavLink to="/admin/forms" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-list-check me-2" /> Form List
//                             </NavLink>
//                         )}
                        
//                         {/* 6. Form Response */}
//                         {hasAccess("submissions", "response") && (
//                             <NavLink to="/admin/submissions" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-envelope-paper me-2" /> Form Responses
//                             </NavLink>
//                         )}

//                         {/* 7. Consent Withdraw Request */}
//                         {hasAccess("withdraw") && (
//                             <NavLink to="/admin/withdrawRequest" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-shield-x me-2" /> Withdraw Requests
//                             </NavLink>
//                         )}

//                         {/* 8. Grievances */}
//                         {(hasAccess("grievance", "grievances") || hasCustomAccess(999)) && (
//                             <NavLink to="/admin/grievances" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
//                                 <i className="bi bi-exclamation-octagon me-2" /> Grievances
//                             </NavLink>
//                         )}

//                         {/* 9. Logout */}
//                         {menusLoaded && (
//                             <button className="btn btn-danger mt-4" onClick={logoutAdmin} type="button">
//                                 Logout
//                             </button>
//                         )}
//                     </>
//                 )}
//             </div>
//         </aside>
//     );
// };

// export default Sidebar;

import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useOrganizationAuth } from "../Context/organizationContext";
import { useProject } from "../Context/projectContext";
import { getAdminMenus } from "../Api/Admin/getAdminMenuList";

type Props = {
    onClose: () => void;
    onNav?: () => void;
};

const Sidebar: React.FC<Props> = ({ onClose, onNav }) => {
    const location = useLocation();

    const { logout, isAuthenticated: isOrgAuthenticated } = useOrganizationAuth();
    const { logoutAdmin, isAdminAuthenticated, admin, roles } = useProject();

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

    const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);
    const [menusLoaded, setMenusLoaded] = useState(false);

    useEffect(() => {
        if (sidebarMode === "admin" && admin?.adCode) {
            getAdminMenus({ adCode: admin.adCode })
                .then(menus => {
                    // Extract routes and normalize them to exact paths
                    const routes = menus.map((m: any) => {
                        const r = (m.Route || m.PageKey || m.PageName || "").toLowerCase();
                        if (r.includes("dashboard")) return "/admin/dashboard";
                        if (r.includes("addadmin") || r.includes("role") || r.includes("user")) return "/admin/addadmin";
                        if (r.includes("privacy")) return "/admin/privacynotices";
                        if (r.includes("builder") || r.includes("new form")) return "/admin/builder";
                        if (r.includes("submission") || r.includes("response")) return "/admin/submissions";
                        if (r.includes("forms") || r.includes("form list")) return "/admin/forms";
                        if (r.includes("withdraw")) return "/admin/withdrawrequest";
                        if (r.includes("grievance")) return "/admin/grievances";
                        return r;
                    }).filter(Boolean);
                    
                    setAllowedRoutes(routes);
                    setMenusLoaded(true);
                })
                .catch(err => {
                    console.error("Failed to load sidebar menus", err);
                    setMenusLoaded(true);
                });
        }
    }, [sidebarMode, admin?.adCode]);

    // 🔥 STRICT GATEKEEPER: This function guarantees a section stays hidden if you disabled it.
    const hasAccess = (exactRoute: string) => {
        // Main Admin always sees everything by default
        if (admin?.tType?.toLowerCase() === "mainadmin") return true;
        
        // 1. Check the Strict Local Engine FIRST. 
        // If you unchecked it in the UI, this forces it to hide regardless of what the backend says.
        if (admin?.roleId) {
            const localPerm = localStorage.getItem(`PERM_${exactRoute}_ROLE_${admin.roleId}`);
            if (localPerm === "Y") return true;
            if (localPerm === "N") return false; // Strictly hides disabled items
        }

        // 2. Fallback to backend API if the local engine hasn't recorded this permission yet
        if (!menusLoaded) return false; 
        return allowedRoutes.includes(exactRoute);
    };

    return (
        <aside className="sidebar p-3">
            <button className="btn btn-outline-secondary btn-sm d-lg-none mb-3" onClick={onClose} type="button">
                <i className="bi bi-x-lg" />
            </button>

            <div className="d-flex align-items-center gap-3 p-2 panel mb-3">
                <div className="brand-badge">FF</div>
                <div>
                    <div className="fw-bold">NJ Softtech</div>
                    <div className="text-secondary small">
                        {sidebarMode === "admin" ? "Admin Panel" : sidebarMode === "organization" ? "Organization" : ""}
                    </div>
                </div>
            </div>

            <div className="nav nav-pills flex-column gap-2">
                
                {/* ── SERVICE PROVIDER PORTAL LINKS ── */}
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
                        <button className="btn btn-danger mt-4" onClick={logout} type="button">
                            Logout
                        </button>
                    </>
                )}

                {/* ── ADMIN PANEL LINKS (Protected by Strict Local Engine) ── */}
                {sidebarMode === "admin" && (
                    <>
                        {!menusLoaded && (
                            <div className="text-center py-4">
                                <div className="spinner-border spinner-border-sm text-secondary" />
                            </div>
                        )}

                        {/* Each NavLink explicitly checks its exact route path */}
                        {hasAccess("/admin/dashboard") && (
                            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-speedometer2 me-2" /> Dashboard
                            </NavLink>
                        )}
                        
                        {hasAccess("/admin/addadmin") && (
                            <NavLink to="/admin/addAdmin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-people me-2" /> Role List
                            </NavLink>
                        )}
                        
                        {hasAccess("/admin/privacynotices") && (
                            <NavLink to="/admin/privacyNotices" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-file-earmark-lock2 me-2" /> Privacy Notices
                            </NavLink>
                        )}

                        {hasAccess("/admin/builder") && (
                            <NavLink to="/admin/builder" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-ui-checks-grid me-2" /> Add New Form
                            </NavLink>
                        )}
                        
                        {hasAccess("/admin/forms") && (
                            <NavLink to="/admin/forms" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-list-check me-2" /> Form List
                            </NavLink>
                        )}
                        
                        {hasAccess("/admin/submissions") && (
                            <NavLink to="/admin/submissions" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-envelope-paper me-2" /> Form Responses
                            </NavLink>
                        )}

                        {hasAccess("/admin/withdrawrequest") && (
                            <NavLink to="/admin/withdrawRequest" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-shield-x me-2" /> Withdraw Requests
                            </NavLink>
                        )}

                        {hasAccess("/admin/grievances") && (
                            <NavLink to="/admin/grievances" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNav}>
                                <i className="bi bi-exclamation-octagon me-2" /> Grievances
                            </NavLink>
                        )}

                        {menusLoaded && (
                            <button className="btn btn-danger mt-4" onClick={logoutAdmin} type="button">
                                Logout
                            </button>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;