// import React, { useState } from "react";
// import PrivacyNoticeList from "./PrivacyNoticeList";
// import PrivacyNoticeBuilder from "./PrivacyNoticeBuilder";

// type View = "list" | "builder";

// const PrivacyNoticePage: React.FC = () => {
//     const [view, setView] = useState<View>("list");
//     const [editId, setEditId] = useState<string | null>(null);

//     const handleCreateNew = () => {
//         setEditId(null);
//         setView("builder");
//     };

//     const handleEdit = (id: string) => {
//         setEditId(id);
//         setView("builder");
//         console.log("Edit notice:", id);
//         // TODO: load notice data by id and pass to builder
//     };

//     const handleBackToList = () => {
//         setEditId(null);
//         setView("list");
//     };

//     return (
//         <div>
//             {view === "builder" && (
//                 <div className="mb-3">
//                     <button
//                         className="btn btn-sm d-flex align-items-center gap-2"
//                         style={{
//                             background: "rgba(255,255,255,0.05)",
//                             border: "1px solid rgba(255,255,255,0.1)",
//                             color: "var(--bs-secondary-color)",
//                         }}
//                         onClick={handleBackToList}
//                     >
//                         <i className="bi bi-arrow-left" />
//                         Back to Notices
//                     </button>
//                 </div>
//             )}

//             {view === "list" && (
//                 <PrivacyNoticeList
//                     onCreateNew={handleCreateNew}
//                     onEdit={handleEdit}
//                 />
//             )}

//             {view === "builder" && (
//                 <PrivacyNoticeBuilder />
//             )}
//         </div>
//     );
// };

// export default PrivacyNoticePage;

import React, { useState } from "react";
import PrivacyNoticeList from "./PrivacyNoticeList";
import PrivacyNoticeBuilder from "./PrivacyNoticeBuilder";

type View = "list" | "builder";

const PrivacyNoticePage: React.FC = () => {
    const [view, setView] = useState<View>("list");
    const [editId, setEditId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);

    const handleCreateNew = () => {
        setEditId(null);
        setEditData(null);
        setView("builder");
    };

    // 🔥 FIX: Properly passes the ID and Notice Data down to the Builder
    const handleEdit = (id: string, noticeData: any) => {
        setEditId(id);
        setEditData(noticeData);
        setView("builder");
    };

    const handleBackToList = () => {
        setEditId(null);
        setEditData(null);
        setView("list");
    };

    return (
        <div>
            {view === "builder" && (
                <div className="mb-3">
                    <button
                        className="btn btn-sm d-flex align-items-center gap-2"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--bs-secondary-color)" }}
                        onClick={handleBackToList}
                    >
                        <i className="bi bi-arrow-left" /> Back to Notices
                    </button>
                </div>
            )}

            {view === "list" && (
                <PrivacyNoticeList onCreateNew={handleCreateNew} onEdit={handleEdit} />
            )}

            {view === "builder" && (
                <PrivacyNoticeBuilder editId={editId} editData={editData} onClose={handleBackToList} />
            )}
        </div>
    );
};

export default PrivacyNoticePage;