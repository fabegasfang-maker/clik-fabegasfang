export type GrinderId = 'mischief-m40' | 'lenodi';

export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

export type BrewMethod =
  | 'cezve'
  | 'espresso'
  | 'moka'
  | 'aeropress'
  | 'v60'
  | 'origami'
  | 'kalita'
  | 'french-press'
  | 'cold-brew';

export type ExtractionVerdict = 'under' | 'balanced' | 'over';

export interface MethodRange {
  method: BrewMethod;
  nameTh: string;
  nameEn: string;
  minClicks: number;
  maxClicks: number;
  recommended: number;
  microns: string;
  ratio: string;
  tempC: number;
  descriptionTh: string;
}

export interface GrinderProfile {
  id: GrinderId;
  name: string;
  brand: string;
  model: string;
  burrType: string;
  burrSize: string;
  adjustmentType: string;
  clickPitchMicrons: number;
  maxClicks: number;
  image: string;
  descriptionTh: string;
  features: string[];
  ranges: MethodRange[];
}

export interface BrewLog {
  id: string;
  createdAt: string; // ISO string
  grinderId: GrinderId;
  clicks: number;
  // Coffee Details
  beanName: string;
  origin: string;
  roastLevel: RoastLevel;
  process?: string;
  roastDate?: string;
  // Recipe
  method: BrewMethod;
  dripper?: string;
  doseGrams: number;
  waterGrams: number;
  ratio?: string;
  waterTempC?: number;
  brewTimeSeconds?: number;
  // Sensory & Assessment
  rating: number; // 1-5
  flavorNotes: string[];
  extractionVerdict: ExtractionVerdict;
  tasteNotes?: string;
  isFavorite?: boolean;
}
