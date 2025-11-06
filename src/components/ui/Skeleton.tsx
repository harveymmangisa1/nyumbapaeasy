import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`animate-pulse bg-slate-200 rounded h-3 ${i < lines - 1 ? 'mb-2' : ''}`} />
    ))}
  </div>
);

export default Skeleton;
