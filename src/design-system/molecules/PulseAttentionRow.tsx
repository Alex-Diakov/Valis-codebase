import React from 'react';
import { AttentionItem } from '../../types/valis';

interface PulseAttentionRowProps {
  item: AttentionItem;
  onSelectDrilldown: (key: AttentionItem['drilldownKey']) => void;
}

export const PulseAttentionRow: React.FC<PulseAttentionRowProps> = ({
  item,
  onSelectDrilldown,
}) => (
  <div className="py-3 first:pt-2 last:pb-1 flex items-start justify-between gap-4">
    <div>
      <div className="text-[13.5px] font-semibold text-valis-text">
        {item.headline}
      </div>
      <div className="text-[12.5px] text-valis-secondary mt-0.5">{item.subline}</div>
    </div>
    <button
      type="button"
      onClick={() => onSelectDrilldown(item.drilldownKey)}
      className="text-[12.5px] text-valis-blue font-medium underline decoration-valis-blueunderline underline-offset-4 hover:decoration-valis-blue shrink-0 cursor-pointer"
    >
      {item.actionLabel}
    </button>
  </div>
);
