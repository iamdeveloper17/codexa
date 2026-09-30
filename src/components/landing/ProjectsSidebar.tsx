"use client";

import { SavedProject } from "@/lib/storage";

interface ProjectsSidebarProps {
    projects: SavedProject[];
    onLoad: (project: SavedProject) => void;
    onDelete: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectsSidebar({
    projects,
    onLoad,
    onDelete,
    isOpen,
    onClose,
}: ProjectsSidebarProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        zIndex: 40,
                    }}
                />
            )}

            {/* Sidebar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: isOpen ? 0 : "-340px",
                    width: "340px",
                    height: "100vh",
                    background: "rgba(17, 24, 39, 0.98)",
                    backdropFilter: "blur(12px)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                    zIndex: 50,
                    transition: "left 0.3s ease",
                    padding: "24px",
                    overflowY: "auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <h2
                        style={{
                            color: "#ffffff",
                            fontSize: "18px",
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        📁 Saved Projects
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#6b7280",
                            fontSize: "28px",
                            cursor: "pointer",
                            lineHeight: 1,
                            padding: 0,
                        }}
                    >
                        ×
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div
                        style={{
                            color: "#6b7280",
                            fontSize: "14px",
                            textAlign: "center",
                            padding: "40px 20px",
                            lineHeight: 1.6,
                        }}
                    >
                        No saved projects yet.
                        <br />
                        <br />
                        Generate code and click{" "}
                        <span style={{ color: "#a78bfa", fontWeight: 600 }}>Save</span>{" "}
                        to keep it here!
                    </div>
                ) : (
                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                    >
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    padding: "12px 14px",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "10px",
                                    transition: "all 0.2s",
                                }}
                            >
                                <div
                                    onClick={() => onLoad(project)}
                                    style={{
                                        color: "#e5e7eb",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        marginBottom: "8px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        cursor: "pointer",
                                    }}
                                    title={project.prompt}
                                >
                                    {project.prompt}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ color: "#6b7280", fontSize: "11px" }}>
                                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(project.id);
                                        }}
                                        style={{
                                            background: "rgba(239, 68, 68, 0.1)",
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            color: "#fca5a5",
                                            fontSize: "11px",
                                            cursor: "pointer",
                                            padding: "3px 8px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}