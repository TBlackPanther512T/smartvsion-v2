
export interface MediaFile {
  id: string;
  file: File;
  url: string;
  name: string;
  type: 'video' | 'image';
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export enum LensSide {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface LensColor {
  r: number;
  g: number;
  b: number;
  c: number;
  m: number;
  y: number;
  k: number;
  bw: number; // Black and white intensity 0-100
}

export const DEFAULT_COLOR: LensColor = {
  r: 0,
  g: 0,
  b: 0,
  c: 0,
  m: 0,
  y: 0,
  k: 0,
  bw: 0
};
