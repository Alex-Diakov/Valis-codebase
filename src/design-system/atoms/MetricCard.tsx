import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => (
  <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-4 flex flex-col justify-start min-h-[104px]">
    <div className="text-[12.5px] text-valis-secondary leading-[1.35]">{label}</div>
    <div className="text-[23px] font-bold text-valis-text tracking-[-0.02em] tabular-nums mt-2">
      {value}
    </div>
  </div>
);
