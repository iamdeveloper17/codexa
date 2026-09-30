import { createClient } from "@/lib/supabase/client";

export interface SavedProject {
  id: string;
  prompt: string;
  code: string;
  createdAt: number;
}

let cachedProjects: SavedProject[] = [];

export async function getProjects(): Promise<SavedProject[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load projects:", error);
    return [];
  }

  cachedProjects = (data || []).map((p) => ({
    id: p.id,
    prompt: p.prompt,
    code: p.code,
    createdAt: new Date(p.created_at).getTime(),
  }));

  return cachedProjects;
}

export async function saveProject(
  prompt: string,
  code: string
): Promise<SavedProject | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      prompt,
      code,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save project:", error);
    return null;
  }

  const project: SavedProject = {
    id: data.id,
    prompt: data.prompt,
    code: data.code,
    createdAt: new Date(data.created_at).getTime(),
  };

  cachedProjects = [project, ...cachedProjects];
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete project:", error);
    return;
  }

  cachedProjects = cachedProjects.filter((p) => p.id !== id);
}