import React from 'react';

export const truncateText = (
  text: string | null,
  maxLength: number = 30,
): string => {
  if (!text) return '-';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const getStatusBadge = (
  isActive: boolean | null,
): React.ReactElement => {
  if (isActive === true) {
    return (
      <div className="badge badge-accent badge-success badge-sm">Active</div>
    );
  } else {
    return (
      <div className="badge badge-soft badge-error badge-sm">Inactive</div>
    );
  }
};
