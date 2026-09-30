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
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40"
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-[85vw] max-w-[340px] bg-zinc-950/98 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 overflow-y-auto p-5 sm:p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-bold">📁 Saved Projects</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-3xl leading-none cursor-pointer p-0 w-8 h-8 flex items-center justify-center"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-10 leading-relaxed">
            No saved projects yet.
            <br />
            <br />
            Generate code and click{" "}
            <span className="text-purple-400 font-semibold">Save</span> to keep
            it here!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <button
                  onClick={() => onLoad(project)}
                  className="text-left w-full text-gray-200 text-sm font-medium mb-2 truncate hover:text-purple-300 transition-colors"
                  title={project.prompt}
                >
                  {project.prompt}
                </button>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">
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
                    className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/20 transition-colors"
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