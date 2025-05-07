import { filterGroupsAdoption } from './Adoption'

export interface FilterGroup {
  groupName: string;
  fieldNames: string[];
}

// Map dashboard name to filter group configuration
export const dashboardFilterGroups: Record<string, FilterGroup[]> = {
  // Using dashboard/tab name as key instead of dashboard ID
  'Adoption': filterGroupsAdoption
}

// Helper function to get filter groups by dashboard name/title
export const getFilterGroupsByDashboardName = (dashboardName: string): FilterGroup[] => {
  return dashboardFilterGroups[dashboardName] || []
}