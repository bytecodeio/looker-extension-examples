import { exploresInUseConfig } from './exploresInUse'

export interface ChartConfig {
  type: string;
  options: any;
  dimensionField?: string;
  measureFields?: string[];
  customRenderer?: (data: any[]) => any;
}

// Map chart title to custom configuration
// There will be one of these for each visualization.
// If there is none, it will default to rendering the Looker visualization via embed.
export const chartConfigs: Record<string, ChartConfig> = {
  'Explores in Use': exploresInUseConfig
}

// Helper function to get chart config by title
export const getChartConfigByTitle = (title: string): ChartConfig | undefined => {
  return chartConfigs[title]
}
