import React, { useEffect, useState } from "react";

type Props = {
    onMenuClick: () => void;
};

const FormHeader: React.FC<Props> = ({ onMenuClick }) => {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
    const root = document.documentElement;

    const saved = localStorage.getItem("theme") as "light" | "dark" | null;

    const initialTheme = saved || "dark"; // always default dark

    setTheme(initialTheme);
    root.setAttribute("data-bs-theme", initialTheme);
}, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        const next = theme === "dark" ? "light" : "dark";

        setTheme(next);
        localStorage.setItem("theme", next);
        root.setAttribute("data-bs-theme", next);
    };

    const isDark = theme === "dark";

    return (
        <div className="">
        <div className="panel mb-3">
            <div className="panel-head p-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                 
                    <button
                        className="btn btn-outline-secondary btn-sm d-lg-none"
                        onClick={onMenuClick}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>

              
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={toggleTheme}
                    type="button"
                >
                    <i className={`bi ${isDark ? "bi-moon-stars" : "bi-sun"}`}></i>
                    <span className="ms-1">{isDark ? "Dark" : "Light"}</span>
                </button>
            </div>
        </div>
        </div>
    );
};

export default FormHeader;
