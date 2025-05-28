import { useState } from 'react';

interface UseCampaignExpansionReturn {
  expandedCampaign: number | null;
  toggleCampaign: (campaignId: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isExpanded: (campaignId: number) => boolean;
}

export const useCampaignExpansion = (
  campaignIds: number[] = [],
): UseCampaignExpansionReturn => {
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);

  const toggleCampaign = (campaignId: number): void => {
    setExpandedCampaign((prev) => (prev === campaignId ? null : campaignId));
  };

  const expandAll = (): void => {
    // For single expansion, we'll expand the first campaign
    if (campaignIds.length > 0) {
      setExpandedCampaign(campaignIds[0]);
    }
  };

  const collapseAll = (): void => {
    setExpandedCampaign(null);
  };

  const isExpanded = (campaignId: number): boolean => {
    return expandedCampaign === campaignId;
  };

  return {
    expandedCampaign,
    toggleCampaign,
    expandAll,
    collapseAll,
    isExpanded,
  };
};
