export interface Env {
  AI: any;
  ENVIRONMENT: string;
}

export interface TranscriptionResponse {
  text: string;
  language?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export interface AnalysisResponse {
  catchiness: {
    score: number;
    reasons: string[];
  };
  emotional_profile: {
    primary: string;
    secondary: string[];
    energy_curve: number[];
  };
  similar_songs: Array<{
    title: string;
    artist: string;
    match_percentage: number;
    reason: string;
  }>;
  structure: {
    pattern: string;
    key_changes: string;
    chord_progression: string;
  };
  cultural_impact: string;
}

export interface RemixRequest {
  songData: {
    title: string;
    artist: string;
    genre: string;
  };
  style: 'jazz' | 'lofi' | 'classical' | 'edm' | 'acoustic' | 'synthwave';
}

export interface VisualRequest {
  prompt: string;
  style: string;
}