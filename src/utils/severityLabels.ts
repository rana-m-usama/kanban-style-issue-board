export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  5: 'Critical',
  4: 'High',
  3: 'Moderate',
  2: 'Low',
  1: 'Minor'
};

export const getSeverityLabel = (severity: number): string => {
  return SEVERITY_LABELS[severity as SeverityLevel] || 'Unknown';
};

export const SEVERITY_OPTIONS = [
  { value: 5, label: 'Critical' },
  { value: 4, label: 'High' },
  { value: 3, label: 'Moderate' },
  { value: 2, label: 'Low' },
  { value: 1, label: 'Minor' }
];
