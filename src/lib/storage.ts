import { createClient } from '@/lib/supabase/client'

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

export async function saveProject(prompt: string, code: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert({ prompt, code, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function clearAllProjects(): void {
  localStorage.removeItem(STORAGE_KEY);
}