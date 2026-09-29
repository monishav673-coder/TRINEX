import React from 'react';
import { getStatusConfig } from '../utils/statusHelpers';

export const StatusBadge = ({ status, size = 'md', showDot = true, customLabel = null }) => {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.md} transition-all`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />}
      <span>{customLabel || config.label}</span>
    </span>
  );
};
