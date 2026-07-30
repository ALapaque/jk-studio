// Types de la base — maintenus à la main, alignés sur
// supabase/migrations/0001_init.sql … 0004_series_captions.sql.

/** Orientation calculée à l'upload (enum `public.photo_orientation`). */
export type PhotoOrientation = "portrait" | "landscape";

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

/** Article du journal (blog) — aligné sur 0007_posts.sql. */
export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_path: string | null;
  body: string;
  tags: string[];
  /** Galerie d'images de l'article (0008) : clés Storage + légende, ordonnées. */
  media: { path: string; caption: string }[];
  /** Clé du template de mise en page de la page détail (0010). Défaut `classic`. */
  template: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
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
  /** Date de prise de vue, pour un tri chronologique fiable (0004). */
  shot_at: string | null;
  /** Chapô éditorial affiché à l'ouverture du défilé (0004). */
  intro: string | null;
  /** Clé du template de mise en page de la page détail (0009). Défaut `classic`. */
  template: string;
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
  /** Partie italique de la légende éditoriale (0004). */
  subject: string | null;
  /** Partie en capitales de la légende éditoriale (0004). */
  location: string | null;
  /** Calculée à l'upload : pilote le cadrage cover/contain (0004). */
  orientation: PhotoOrientation | null;
  /** LQIP pour `blurDataURL` de next/image (0004). */
  blur_data_url: string | null;
  /** Largeurs des dérivés WebP présents en Storage (0005). NULL = aucun. */
  variant_widths: number[] | null;
  /** Provenance : fiche de la médiathèque dont cette photo est issue (0006). */
  asset_id: string | null;
}

/** Dossier de la médiathèque (0006). Imbriquable via `parent_id`. */
export interface MediaFolderRow {
  id: string;
  name: string;
  parent_id: string | null;
  position: number;
  created_at: string;
}

/** Fiche d'image de la médiathèque (0006) — la banque, jamais publique. */
export interface MediaAssetRow {
  id: string;
  folder_id: string | null;
  storage_path: string;
  filename: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  orientation: PhotoOrientation | null;
  blur_data_url: string | null;
  variant_widths: number[] | null;
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
      media_folders: Table<MediaFolderRow>;
      media_assets: Table<MediaAssetRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
