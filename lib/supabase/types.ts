// Types de la base — maintenus à la main, alignés sur
// supabase/migrations/0001_init.sql.

export interface CategoryRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  location: string;
  period: string;
  cover_path: string | null;
  position: number;
  created_at: string;
}

export interface ProjectRow {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  period: string;
  cover_path: string | null;
  position: number;
  published: boolean;
  created_at: string;
}

export interface PhotoRow {
  id: string;
  project_id: string | null;
  category_id: string | null;
  storage_path: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  position: number;
  featured: boolean;
  featured_position: number;
  created_at: string;
}

export interface VideoRow {
  id: string;
  project_id: string | null;
  category_id: string | null;
  provider: "youtube" | "vimeo";
  video_id: string;
  title: string | null;
  position: number;
  created_at: string;
}

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  project_type: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

export interface SiteContentRow {
  key: string;
  value: unknown;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      categories: Table<CategoryRow>;
      projects: Table<ProjectRow>;
      photos: Table<PhotoRow>;
      videos: Table<VideoRow>;
      messages: Table<MessageRow>;
      site_content: Table<SiteContentRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
