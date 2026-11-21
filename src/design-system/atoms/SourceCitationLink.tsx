import React from 'react';
import { SourceLink } from '../../types/valis';

interface SourceCitationLinkProps {
  source: SourceLink;
  onSelect: (source: SourceLink) => void;
}

export const SourceCitationLink: React.FC<SourceCitationLinkProps> = ({
  source,
  onSelect,
}) => (
  <button
    type="button"
    onClick={() => onSelect(source)}
    className="text-[12.5px] text-valis-subtle underline decoration-valis-underline underline-offset-2 hover:text-valis-text hover:decoration-valis-text transition-colors cursor-pointer"
  >
    {source.label}
  </button>
);
