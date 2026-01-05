import React from 'react';
import { TechItem, MetricData } from './types';

export const PROJECT_NAME = "Cardia ECG";

export const SPLINE_DNA = "https://my.spline.design/dnaparticles-G90aRnTSNqvEFZXuQIAVgCMX/";
export const SPLINE_HUD = "https://my.spline.design/hearthealthhudfuturisticuidesign-bOrUbhOo3AzarwvwPGbtZKhA/";

export const TECH_STACK: TechItem[] = [
  { name: 'Python', icon: '🐍', category: 'Language' },
  { name: 'PyTorch', icon: '🔥', category: 'Framework' },
  { name: '1D ResNet', icon: '🧠', category: 'Model' },
  { name: 'Bi-LSTM', icon: '🔄', category: 'Model' },
  { name: 'Attention', icon: '👁️', category: 'Model' },
  { name: 'Transformer', icon: '⚡', category: 'Model' },
  { name: 'BCE Loss', icon: '📉', category: 'Loss' },
  { name: 'Focal Loss', icon: '🎯', category: 'Loss' },
  { name: 'F1-Score', icon: '📊', category: 'Metric' },
  { name: 'AUC-ROC', icon: '📈', category: 'Metric' },
  { name: 'Hamming Loss', icon: '📏', category: 'Metric' },
  { name: 'FastAPI', icon: '🚀', category: 'Deployment' },
];

export const DATASET_STATS = [
  { label: 'Total Records', value: '6,877', icon: '📂' },
  { label: 'Resampling Rate', value: '250 Hz', icon: '📶' },
  { label: 'Multi-Label Cases', value: '476', icon: '🧬' },
  { label: 'Classes', value: '9 Types', icon: '🏷️' },
];

export const RESULTS_METRICS: MetricData[] = [
  { name: 'AF', value: 0.94, description: 'Atrial Fibrillation' },
  { name: 'PVC', value: 0.89, description: 'Premature Ventricular Contraction' },
  { name: 'LBBB', value: 0.92, description: 'Left Bundle Branch Block' },
  { name: 'RBBB', value: 0.95, description: 'Right Bundle Branch Block' },
  { name: 'PAC', value: 0.87, description: 'Premature Atrial Contraction' },
  { name: 'STD', value: 0.84, description: 'ST-segment Depression' },
  { name: 'STE', value: 0.85, description: 'ST-segment Elevation' },
  { name: 'Normal', value: 0.91, description: 'Normal ECG' },
  { name: 'Others', value: 0.82, description: 'Other Arrhythmias' },
];

export const EVALUATION_PHASES = [
  {
    title: "1D CNN Architectures",
    description: "Deep 1D ResNet/Inception modules optimized for spatial feature extraction across 12-lead signal dimensions.",
    points: ["Multi-Scale Kernels", "Residual Mapping", "Channel Attention"]
  },
  {
    title: "Temporal Recurrence",
    description: "Variable-length sequence handling via Bi-Directional LSTMs and Global Average Pooling for 6-60s signals.",
    points: ["Long-term Context", "Dynamic Padding", "Hidden State Ensemble"]
  },
  {
    title: "Multi-Label Metrics",
    description: "Comprehensive evaluation using Per-Class AUC-ROC, F1-Macro, and Hamming Loss for co-occurring labels.",
    points: ["AUC-ROC > 0.92", "Hamming Loss < 0.05", "BCE-Focal Blend"]
  }
];