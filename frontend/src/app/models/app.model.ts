export interface Product {
  id: number;
  nom: string;
  prix: number;
  url: string;
}

export interface Session {
  id: number;
  nom: string;
  createur: string;
  produits: number[];
  participants?: Participant[];
  participantCount?: number;
  created_at?: string;
}

export interface Participant {
  utilisateur: string;
  reponses: (number | null)[];
}

export interface LeaderboardEntry {
  rank: number;
  utilisateur: string;
  totalScore: number;
  averageScore: number;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  productId: number;
  productName: string;
  estimatedPrice: number;
  realPrice: number;
  score: number;
}

