export interface SavedProject {
  id: string;
  prompt: string;
  code: string;
  createdAt: number;
}

const STORAGE_KEY = "codexa_projects";

export function getProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedProject[];
  } catch {
    return [];
  }
}

export function saveProject(prompt: string, code: string): SavedProject {
  const project: SavedProject = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),
    prompt,
    code,
    createdAt: Date.now(),
  };

  const projects = getProjects();
  projects.unshift(project);
  const trimmed = projects.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  return project;
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function clearAllProjects(): void {
  localStorage.removeItem(STORAGE_KEY);
}