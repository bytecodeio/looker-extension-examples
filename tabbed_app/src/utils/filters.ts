import { IDashboardFilter } from '@looker/sdk'

export interface FilterState {
  [key: string]: string | boolean | string[]
}

/**
 * Creates filter controls based on filter type
 * @param filter The dashboard filter
 * @param filterState Current filter state
 * @param filterSuggestions Available filter suggestions
 * @param handleFilterChange Callback for filter value changes
 */
export const renderFilterControl = (
  filter: IDashboardFilter,
  filterState: FilterState,
  filterSuggestions: Record<string, string[]>,
  handleFilterChange: (filterName: string, value: string | boolean | string[]) => void
) => {
  // This function is a placeholder for the implementation
  // The actual implementation will be in the component
  return null
}

/**
 * Apply filters to query bodies
 * @param queryBodies Array of query bodies
 * @param filters Current filter state
 * @param dashboardFilters Dashboard filter definitions
 */
export const applyFiltersToQueries = async (
  queryBodies: any[], 
  filters: FilterState,
  dashboardFilters: IDashboardFilter[],
  executeQueryFn: (body: any) => Promise<any>
) => {
  try {
    const queryPromises = queryBodies.map(async (item) => {
      try {
        const queryBody = { ...item.queryBody }
        
        Object.keys(filters).forEach(filterName => {
          const filterValue = filters[filterName]
          if (filterValue && filterValue !== '') {
            const dashFilter = dashboardFilters.find(df => df.name === filterName)
            if (dashFilter && dashFilter.dimension) {
              // Handle array values correctly - Looker expects comma-separated strings
              if (Array.isArray(filterValue)) {
                queryBody.filters[dashFilter.dimension] = filterValue.join(',')
              } else {
                queryBody.filters[dashFilter.dimension] = filterValue.toString()
              }
            }
          }
        })
        
        console.log('Applying filters to query:', queryBody.filters)
        
        const result = await executeQueryFn({
          body: queryBody,
          result_format: 'json'
        })
        
        return {
          success: true,
          elementId: item.elementId || '',
          elementTitle: item.elementTitle || 'Untitled Element',
          data: result,
          clientId: item.clientId
        }
      } catch (error) {
        console.error(`Error processing query for element ${item.elementId}:`, error)
        return {
          success: false,
          elementId: item.elementId || '',
          elementTitle: item.elementTitle || 'Untitled Element',
          error
        }
      }
    })
    
    return await Promise.all(queryPromises)
  } catch (err) {
    console.error('Error executing queries:', err)
    throw err
  }
}