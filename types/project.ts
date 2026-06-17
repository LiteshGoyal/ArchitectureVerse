export interface Project {
  id: number;
  owner: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}