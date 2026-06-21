export interface SeoScores {
  title_score: number;
  description_score: number;
  keyword_score: number;
  overall: number;
}

export interface PinterestMetadata {
  title: string;
  description: string;
  alt_text: string;
  primary_keywords: string[];
  secondary_keywords: string[];
  hashtags: string[];
  board_suggestions: string[];
  best_posting_time: string;
  seo_scores: SeoScores;
  seo_label: string;
}

export type InputMode = 'image' | 'url' | 'text';
