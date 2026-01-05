
export interface ArrhythmiaResult {
  label: string;
  fullName: string;
  confidence: number;
}

export interface MetricData {
  name: string;
  value: number;
  description: string;
}

export interface TechItem {
  name: string;
  icon: string;
  category: 'Language' | 'Framework' | 'Model' | 'Loss' | 'Metric' | 'Deployment';
}
