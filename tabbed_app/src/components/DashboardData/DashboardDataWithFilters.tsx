import React, { useContext, useEffect, useState } from 'react'
import { ExtensionContext, ExtensionContextData } from '@looker/extension-sdk-react'
import { 
  Box, 
  Heading, 
  Spinner, 
  MessageBar, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableHeaderCell, 
  TableDataCell, 
  SpaceVertical,
  Form,
  FieldSelect,
  FieldText,
  FieldToggleSwitch,
  ButtonOutline,
  Divider,
  FlexItem,
  Flex,
  Combobox
} from '@looker/components'
import { IDashboard, IDashboardElement, IDashboardFilter } from '@looker/sdk'

interface DashboardDataWithFiltersProps {
  dashboardId: string
}

interface QueryResult {
  elementId: string
  elementTitle: string
  data: any[]
}

interface FilterState {
  [key: string]: string | boolean | string[]
}

interface FilterSuggestions {
  [key: string]: string[]
}

export const DashboardDataWithFilters: React.FC<DashboardDataWithFiltersProps> = ({ dashboardId }) => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK
  
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<IDashboard | null>(null)
  const [dashboardFilters, setDashboardFilters] = useState<IDashboardFilter[]>([])
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])
  const [filterState, setFilterState] = useState<FilterState>({})
  const [queryBodies, setQueryBodies] = useState<any[]>([])
  const [filterSuggestions, setFilterSuggestions] = useState<FilterSuggestions>({})
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get dashboard details
        const dashboardData = await sdk.ok(sdk.dashboard(dashboardId))
        setDashboard(dashboardData as IDashboard)
        
        // Extract dashboard filters
        if (dashboardData.dashboard_filters && dashboardData.dashboard_filters.length > 0) {
          setDashboardFilters(dashboardData.dashboard_filters)
          
          // Initialize filter state with empty values
          const initialFilterState: FilterState = {}
          dashboardData.dashboard_filters.forEach(filter => {
            initialFilterState[filter.name] = filter.default_value || ''
          })
          setFilterState(initialFilterState)
          
          // Fetch suggestions for string-type filters
          fetchFilterSuggestions(dashboardData.dashboard_filters)
        }
        
        // Extract query bodies from dashboard elements
        const bodies: any[] = []
        
        for (const element of dashboardData.dashboard_elements || []) {
          if (element.query) {
            bodies.push({
              elementId: element.id,
              elementTitle: element.title,
              queryBody: {
                model: element.query.model,
                view: element.query.view,
                fields: element.query.fields || [],
                pivots: element.query.pivots || [],
                fill_fields: element.query.fill_fields || [],
                filters: { ...element.query.filters } || {},
                filter_expression: element.query.filter_expression || "",
                sorts: element.query.sorts || [],
                limit: element.query.limit || "",
                column_limit: element.query.column_limit || "",
                total: element.query.total || false,
                row_total: element.query.row_total || "",
                subtotals: element.query.subtotals || [],
                vis_config: element.query.vis_config || {},
                filter_config: element.query.filter_config || {},
                visible_ui_sections: element.query.visible_ui_sections || "",
                dynamic_fields: element.query.dynamic_fields || "",
                query_timezone: element.query.query_timezone || ""
              }
            })
          }
        }
        
        setQueryBodies(bodies)
        
        // Execute queries with initial filter state
        await executeQueries(bodies, {})
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(`Failed to fetch dashboard data: ${err.message || 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    if (dashboardId) {
      fetchDashboardData()
    } else {
      setError('No dashboard ID provided')
      setLoading(false)
    }
  }, [dashboardId])
  
  // Fetch suggestions for string-type filters
  const fetchFilterSuggestions = async (filters: IDashboardFilter[]) => {
    setLoadingSuggestions(true)
    const suggestions: FilterSuggestions = {}
    
    try {
      console.log('Fetching filter suggestions...', filters)
      // Create an array of promises for parallel execution
      const suggestionPromises = filters
        .filter(filter => filter.field?.type === 'string' && filter.dimension)
        .map(async (filter) => {
          console.log('Fetching suggestions for filter:', filter.name)
          try {
            const [view, field] = filter?.field?.suggest_dimension?.split('.') || []
            const model = filter?.model 
            console.log('Filter model, view, field:', model, view, field)
            // Skip if we don't have complete info
            if (!model || !view || !field) return null
            
            // Create a query to fetch distinct values
            const queryResponse = await sdk.ok(sdk.run_inline_query({
              body: {
                model: model,
                view: view,
                fields: [filter?.field?.suggest_dimension],
                filters: {},
                limit: '500',
                sorts: [filter.dimension + ' asc']
              },
              result_format: 'json'
            }))
            console.log('Filter Query response:', queryResponse)
            // Extract values from response
            const values = queryResponse.map(row => {
              const key = Object.keys(row)[0]
              return row[key]?.toString() || ''
            }).filter(Boolean)
            
            return { name: filter.name, values }
          } catch (error) {
            console.error(`Error fetching suggestions for filter ${filter.name}:`, error)
            return null
          }
        })
      
      // Wait for all suggestion queries to complete
      const results = await Promise.all(suggestionPromises)
      console.log('Filter suggestions results:', results)
      // Add successful results to suggestions object
      results
        .filter(Boolean)
        .forEach(result => {
          if (result) {
            suggestions[result.name] = result.values
          }
        })
      console.log('Filter suggestions fetched:', suggestions)
      setFilterSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching filter suggestions:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }
  
  const executeQueries = async (bodies: any[], filters: FilterState) => {
    try {
      setLoading(true)
      
      // Create an array of promises for all queries to run in parallel
      const queryPromises = bodies.map(async (item) => {
        try {
          const queryBody = { ...item.queryBody }
          
          // Apply filters to the query body
          if (Object.keys(filters).length > 0) console.log('Applying filters:', filters)
          Object.keys(filters).forEach(filterName => {
            const filterValue = filters[filterName]
            if (filterValue && filterValue !== '') {
              const dashFilter = dashboardFilters.find(df => df.name === filterName)
              if (dashFilter && dashFilter.dimension) {
                queryBody.filters[dashFilter.dimension] = filterValue.toString()
              }
            }
          })
          
          // Execute the query
          const result = await sdk.ok(sdk.run_inline_query({
            body: queryBody,
            result_format: 'json'
          }))
          
          // Return the result with metadata
          return {
            success: true,
            elementId: item.elementId || '',
            elementTitle: item.elementTitle || 'Untitled Element',
            data: result
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
      
      // Wait for all queries to complete in parallel
      const results = await Promise.all(queryPromises)
      
      // Filter only successful results
      const successfulResults = results
        .filter(result => result.success)
        .map(({ elementId, elementTitle, data }) => ({
          elementId,
          elementTitle,
          data
        }))
      
      // Log any errors
      const failedQueries = results.filter(result => !result.success)
      if (failedQueries.length > 0) {
        console.error(`${failedQueries.length} queries failed:`, failedQueries)
      }
      
      console.log('All queries completed, updating results state...')
      setQueryResults(successfulResults)
    } catch (err) {
      console.error('Error executing queries:', err)
      setError(`Failed to execute queries: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  const applyFilters = (e) => {
    // Prevent default form submission behavior which might cause navigation
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    
    // Prevent unnecessary re-renders by ensuring state updates are minimal
    executeQueries(queryBodies, filterState)
  }
  
  const handleFilterChange = (filterName: string, value: string | boolean | string[]) => {
    const newFilterState = {
      ...filterState,
      [filterName]: value
    }
    setFilterState(newFilterState)
  }
  
  // Render filter controls based on filter type
  const renderFilterControl = (filter: IDashboardFilter) => {
    const filterType = filter.field?.type || 'string'
    const currentValue = filterState[filter.name]
    const suggestions = filterSuggestions[filter.name] || []
    
    switch (filterType) {
      case 'boolean':
        return (
          <FieldToggleSwitch
            label={filter.title || filter.name}
            onChange={(e) => handleFilterChange(filter.name, e.target.checked)}
            on={!!currentValue}
          />
        )
      case 'number':
        return (
          <FieldText
            label={filter.title || filter.name}
            type="number"
            value={currentValue as string || ''}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
          />
        )
      case 'string':
        // If we have suggestions, use a FieldSelect component instead of Combobox
        if (suggestions.length > 0) {
          return (
            <FieldSelect
              label={filter.title || filter.name}
              options={suggestions.map(option => ({ value: option, label: option }))}
              value={currentValue as string || ''}
              onChange={(value) => handleFilterChange(filter.name, value)}
              placeholder="Select a value"
            />
          )
        } else {
          // Fall back to text field if no suggestions
          return (
            <FieldText
              label={filter.title || filter.name}
              value={currentValue as string || ''}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            />
          )
        }
      default:
        return (
          <FieldText
            label={filter.title || filter.name}
            value={currentValue as string || ''}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
          />
        )
    }
  }
  
  // Helper function to render table data
  const renderQueryData = (data: any[]) => {
    if (!data || data.length === 0) return <Box>No data available</Box>
    
    // Get column headers from the first data item
    const columns = Object.keys(data[0])
    
    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map(column => (
                <TableDataCell key={`${rowIndex}-${column}`}>
                  {JSON.stringify(row[column])}
                </TableDataCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (loading && !queryResults.length) {
    return (
      <Box p="large" display="flex" justifyContent="center" alignItems="center">
        <Spinner size={50} />
      </Box>
    )
  }

  if (error && !queryResults.length) {
    return <MessageBar intent="critical">{error}</MessageBar>
  }

  return (
    <Box p="large">
      {dashboard && (
        <SpaceVertical>
          <Heading as="h1">{dashboard.title || 'Dashboard Data with Filters'}</Heading>
          
          {dashboardFilters.length > 0 && (
            <Box mb="large" p="medium" border="1px solid" borderColor="neutral-300" borderRadius="medium">
              <Form onSubmit={(e) => {
                // Explicitly prevent form submission
                e.preventDefault()
                applyFilters(e)
              }}>
                <Heading as="h3" mb="small">Dashboard Filters</Heading>
                {loadingSuggestions && (
                  <Box mb="small">
                    <Spinner size={20} /> Loading filter suggestions...
                  </Box>
                )}
                <Flex flexWrap="wrap" gap="medium">
                  {dashboardFilters.map(filter => (
                    <FlexItem key={filter.id} width="250px">
                      {renderFilterControl(filter)}
                    </FlexItem>
                  ))}
                  <FlexItem alignSelf="flex-end">
                    <ButtonOutline 
                      type="button" 
                      onClick={(e) => applyFilters(e)}>
                      Apply Filters
                    </ButtonOutline>
                  </FlexItem>
                </Flex>
              </Form>
            </Box>
          )}
          
          {loading && queryResults.length > 0 && (
            <Box py="medium" display="flex" justifyContent="center">
              <Spinner size={30} /> <Box ml="small">Updating results...</Box>
            </Box>
          )}
          
          {queryResults.length > 0 ? (
            queryResults.map(result => (
              <Box key={result.elementId} mb="xlarge">
                <Heading as="h2" mb="medium">{result.elementTitle}</Heading>
                {renderQueryData(result.data)}
              </Box>
            ))
          ) : (
            <Box>No query data found in this dashboard</Box>
          )}
        </SpaceVertical>
      )}
    </Box>
  )
}
