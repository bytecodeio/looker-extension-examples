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
  Tabs2,
  Tab2,
  FieldCheckbox,
  ButtonGroup,
  ButtonItem
} from '@looker/components'
import { IDashboard, IDashboardElement, IDashboardFilter } from '@looker/sdk'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { getChartConfigByTitle } from './chartConfigs'
import { determineChartType, generateChartOptions, mergeDeep } from './chartConfigs/defaultChartConfig'
import { QueryEmbed } from './QueryEmbed'
import { getFilterGroupsByDashboardName } from './filterConfigs'
import { FilterState, applyFiltersToQueries } from '../../utils'

interface DashboardDataWithFiltersProps {
  dashboardId: string
  tabName?: string // Added tab name prop
}

interface QueryResult {
  elementId: string
  elementTitle: string
  data: any[]
  clientId?: string
}

interface FilterSuggestions {
  [key: string]: string[]
}

interface FilterChangeInfo {
  filterName: string;
  value: string | boolean | string[];
  timestamp: number;
}

export const DashboardDataWithFilters: React.FC<DashboardDataWithFiltersProps> = ({ 
  dashboardId,
  tabName // Use the tab name if provided 
}) => {
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
  const [chartPreferences, setChartPreferences] = useState<Record<string, string>>({})
  const [autoSelectChartType, setAutoSelectChartType] = useState<boolean>(true)
  const [filterGroups, setFilterGroups] = useState<{ groupName: string; fieldNames: string[] }[]>([])
  
  // State to track the last changed filter
  const [lastChangedFilter, setLastChangedFilter] = useState<FilterChangeInfo | null>(null)
 
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const dashboardData = await sdk.ok(sdk.dashboard(dashboardId))
        setDashboard(dashboardData as IDashboard)
        
        // Get filter groups based on dashboard title or provided tab name
        const dashboardName = tabName || dashboardData.title || ''
        console.log('Looking for filter groups for dashboard:', dashboardName)
        const groups = getFilterGroupsByDashboardName(dashboardName)
        console.log('Found filter groups:', groups)
        setFilterGroups(groups)
        
        if (dashboardData.dashboard_filters && dashboardData.dashboard_filters.length > 0) {
          setDashboardFilters(dashboardData.dashboard_filters)
          
          const initialFilterState: FilterState = {}
          dashboardData.dashboard_filters.forEach(filter => {
            initialFilterState[filter.name] = filter.default_value || ''
          })
          setFilterState(initialFilterState)
          
          fetchFilterSuggestions(dashboardData.dashboard_filters)
        }
        
        const bodies: any[] = []
        
        for (const element of dashboardData.dashboard_elements || []) {
          if (element.query) {
            bodies.push({
              elementId: element.id,
              elementTitle: element.title,
              clientId: element.query.client_id,
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
  }, [dashboardId, tabName])
  


  const fetchFilterSuggestions = async (filters: IDashboardFilter[], specificFilterName?: string, customFilterState?: FilterState) => {
    setLoadingSuggestions(true)
    
    try {
      // If a specific filter name is provided, only fetch suggestions for that filter
      const filtersToProcess = specificFilterName 
        ? filters.filter(filter => filter.name === specificFilterName)
        : filters.filter(filter => filter.field?.type === 'string' && filter.dimension);
      
      // Create a copy of the current suggestions
      const updatedSuggestions = { ...filterSuggestions };
      
      // Use customFilterState if provided, otherwise use the current filterState
      const currentFilterValues = customFilterState || filterState;
      
      const suggestionPromises = filtersToProcess
        .map(async (filter) => {
          try {
            const listeners = filter?.listens_to_filters
            console.log(`Filter ${filter.name} listens to:`, listeners)
            
            // Parse dimension to get model, view, and field
            const dimension = filter?.dimension
            if (!dimension) return null
            
            // Split dimension into view and field parts (view.field)
            const [viewName, fieldName] = dimension.split('.')
            if (!viewName || !fieldName) return null
            
            // Get model name from filter
            const modelName = filter?.model
            if (!modelName) return null
            
            const exploreName = filter?.explore
            if (!exploreName) return null
            
            // Create a filter object for the query
            const queryFilters: Record<string, string> = {}
            
            if (listeners && listeners.length > 0) {
              listeners.forEach(listenerName => {
                const listenerValue = currentFilterValues[listenerName]
                if (listenerValue) {
                  // Find the filter definition to get the dimension
                  const listenerFilter = filters.find(f => f.name === listenerName)
                  if (listenerFilter?.dimension) {
                    // Add filter to the query filters
                    if (Array.isArray(listenerValue)) {
                      queryFilters[listenerFilter.dimension] = listenerValue.join(',')
                    } else {
                      queryFilters[listenerFilter.dimension] = listenerValue.toString()
                    }
                  }
                }
              })
            }
            
            console.log(`Fetching suggestions for ${filter.name} with filters:`, queryFilters)
            
            try {
              // Use run_inline_query which we know works properly
              const queryResponse = await sdk.ok(sdk.run_inline_query({
                body: {
                  model: modelName,
                  view: exploreName,
                  fields: [dimension],
                  filters: queryFilters,
                  limit: '500',
                  // Sort values alphabetically for better UX
                  sorts: [`${dimension} asc`]
                },
                result_format: 'json'
              }))
              
              // Extract unique values from the response
              const values: Set<string> = new Set()
              
              if (Array.isArray(queryResponse)) {
                queryResponse.forEach(row => {
                  const value = row[dimension]
                  if (value !== null && value !== undefined) {
                    values.add(value.toString())
                  }
                })
              }
              
              const uniqueValues = Array.from(values)
              console.log(`Found ${uniqueValues.length} suggestions for ${filter.name}`)
              
              return { name: filter.name, values: uniqueValues }
            } catch (sdkError) {
              console.error(`SDK error fetching suggestions for ${filter.name}:`, sdkError)
              // Return empty values array but don't fail the entire promise
              return { name: filter.name, values: [] }
            }
          } catch (error) {
            console.error(`Error fetching suggestions for filter ${filter.name}:`, error)
            return { name: filter.name, values: [] }
          }
        })
      
      const results = await Promise.all(suggestionPromises)
      
      // Update suggestions with new values
      results
        .filter(Boolean)
        .forEach(result => {
          if (result) {
            updatedSuggestions[result.name] = result.values
          }
        })
        
      // Set all suggestions at once to avoid React state update issues
      setFilterSuggestions(updatedSuggestions)
    } catch (error) {
      console.error('Error fetching filter suggestions:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }
  
  const fetchFilterSuggestionsBatch = async (filters: IDashboardFilter[], customFilterState: FilterState) => {
    if (!filters || filters.length === 0) return
    
    setLoadingSuggestions(true)
    
    try {
      console.log(`Batch fetching suggestions for ${filters.length} filters:`, 
        filters.map(f => f.name))
      
      // Create a copy of the current suggestions
      const updatedSuggestions = { ...filterSuggestions }
      
      // Process each filter in sequence to avoid race conditions
      for (const filter of filters) {
        try {
          // Skip if this filter is somehow no longer relevant
          if (!filter.name) continue
          
          const dimension = filter?.dimension
          if (!dimension) continue
          
          const [viewName, fieldName] = dimension.split('.')
          if (!viewName || !fieldName) continue
          
          const modelName = filter?.model
          if (!modelName) continue
          
          const exploreName = filter?.explore
          if (!exploreName) continue
          
          // Create a filter object for the query
          const queryFilters: Record<string, string> = {}
          
          // Apply any parent filter values
          const listeners = filter?.listens_to_filters
          if (listeners && listeners.length > 0) {
            listeners.forEach(listenerName => {
              const listenerValue = customFilterState[listenerName]
              if (listenerValue) {
                // Find the filter definition to get the dimension
                const listenerFilter = dashboardFilters.find(f => f.name === listenerName)
                if (listenerFilter?.dimension) {
                  // Add filter to the query filters
                  if (Array.isArray(listenerValue)) {
                    queryFilters[listenerFilter.dimension] = listenerValue.join(',')
                  } else {
                    queryFilters[listenerFilter.dimension] = listenerValue.toString()
                  }
                }
              }
            })
          }
          
          console.log(`Fetching batch suggestions for ${filter.name} with filters:`, queryFilters)
          
          // Use run_inline_query to fetch suggestions
          const queryResponse = await sdk.ok(sdk.run_inline_query({
            body: {
              model: modelName,
              view: exploreName,
              fields: [dimension],
              filters: queryFilters,
              limit: '500',
              sorts: [`${dimension} asc`]
            },
            result_format: 'json'
          }))
          
          // Extract unique values from the response
          const values: Set<string> = new Set()
          
          if (Array.isArray(queryResponse)) {
            queryResponse.forEach(row => {
              const value = row[dimension]
              if (value !== null && value !== undefined) {
                values.add(value.toString())
              }
            })
          }
          
          const uniqueValues = Array.from(values)
          console.log(`Found ${uniqueValues.length} suggestions for ${filter.name}`)
          
          // Update suggestions for this filter
          updatedSuggestions[filter.name] = uniqueValues
        } catch (error) {
          console.error(`Error fetching batch suggestions for filter ${filter.name}:`, error)
          // Continue with the next filter even if one fails
        }
      }
      
      // Update all suggestions at once
      setFilterSuggestions(updatedSuggestions)
    } catch (error) {
      console.error('Error in batch filter suggestion fetch:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }
  
  const executeQueries = async (bodies: any[], filters: FilterState) => {
    try {
      setLoading(true)
      
      const results = await applyFiltersToQueries(
        bodies,
        filters,
        dashboardFilters,
        (queryParams) => sdk.ok(sdk.run_inline_query(queryParams))
      )
      
      const successfulResults = results
        .filter(result => result.success)
        .map(({ elementId, elementTitle, data, clientId }) => ({
          elementId,
          elementTitle,
          data,
          clientId
        }))
      
      const failedQueries = results.filter(result => !result.success)
      if (failedQueries.length > 0) {
        console.error(`${failedQueries.length} queries failed:`, failedQueries)
      }
      
      setQueryResults(successfulResults)
    } catch (err) {
      console.error('Error executing queries:', err)
      setError(`Failed to execute queries: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  const applyFilters = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    executeQueries(queryBodies, filterState)
  }
  
  const handleFilterChange = (filterName: string, value: string | boolean | string[]) => {
    console.log(`Filter ${filterName} changed to:`, value)
    
    // Just update this filter's value
    setFilterState(prevState => ({
      ...prevState,
      [filterName]: value
    }))
    
    // Record which filter changed to trigger the useEffect
    setLastChangedFilter({ 
      filterName, 
      value, 
      timestamp: Date.now() 
    })
  }
  
  // Effect to handle updates when a filter changes
  useEffect(() => {
    if (!lastChangedFilter || !lastChangedFilter.filterName) return;
    
    // Find any filters that listen to the changed filter
    const dependentFilters = dashboardFilters.filter(
      filter => filter.listens_to_filters && 
      filter.listens_to_filters.includes(lastChangedFilter.filterName)
    );
    
    if (dependentFilters.length > 0) {
      console.log(
        `Filter ${lastChangedFilter.filterName} changed to ${lastChangedFilter.value}, updating suggestions for:`, 
        dependentFilters.map(f => f.name)
      );
      
      // Fetch suggestions for dependent filters with the updated filter state
      fetchFilterSuggestionsBatch(dependentFilters, filterState);
    }
  }, [lastChangedFilter, filterState, dashboardFilters]);

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
        if (suggestions.length > 0) {
          // Create options from suggestions
          let options = suggestions.map(option => ({ value: option, label: option }))
          console.log('Filter options for:',filter.name, options)
          return (
            <FieldSelect
              label={filter.title || filter.name}
              options={options}
              value={currentValue as string || ''}
              onChange={(value) => handleFilterChange(filter.name, value)}
              placeholder="Select a value"
              clearable={true}
            />
          )
        } else {
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
  
  const handleChartTypeChange = (elementTitle: string, chartType: string) => {
    setChartPreferences(prev => ({
      ...prev,
      [elementTitle]: chartType
    }))
  }
  
  const renderQueryData = (data: any[], elementId: string, elementTitle: string, clientId?: string) => {
    if (!data || data.length === 0) return <Box>No data available</Box>
    
    const chartType = determineChartType(data, elementTitle)
    const chartOptions = generateChartOptions(data, chartType, elementTitle)
    const customConfig = getChartConfigByTitle(elementTitle)

    // If we have a client ID and there's no custom chart configuration, use the embedded visualization
    if (clientId && !customConfig) {
      return (
        <Box height="450px" width="100%" mb="medium">
          <QueryEmbed clientId={clientId} height="400px" />
        </Box>
      )
    }
    
    const chartTypes = ['bar', 'line', 'pie', 'scatter', 'table']
    
    return (
      <Box height="450px" width="100%" mb="medium">
        <Flex mb="small" alignItems="center" justifyContent="space-between">
          <Box>
            {!customConfig && (
              <FieldCheckbox 
                onChange={() => setAutoSelectChartType(!autoSelectChartType)} 
                checked={autoSelectChartType}
                label="Auto-select chart type"
              />
            )}
            {customConfig && (
              <Box color="neutral">Using custom chart configuration</Box>
            )}
          </Box>
          {!customConfig && !autoSelectChartType && (
            <ButtonGroup>
              {chartTypes.map(type => (
                <ButtonItem 
                  key={type} 
                  selected={chartPreferences[elementTitle] === type || (!chartPreferences[elementTitle] && chartType === type)}
                  onClick={() => handleChartTypeChange(elementTitle, type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </ButtonItem>
              ))}
            </ButtonGroup>
          )}
        </Flex>
        
        {(chartType === 'table' || chartPreferences[elementTitle] === 'table') ? (
          renderDataTable(data)
        ) : (
          <Box height="400px" border="1px solid" borderColor="neutral-300" borderRadius="medium" p="small">
            <ReactECharts 
              option={chartOptions}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </Box>
        )}
      </Box>
    )
  }
  
  const renderDataTable = (data: any[]) => {
    if (!data || data.length === 0) return <Box>No data available</Box>
    
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

  const DashboardFiltersComponent = ({ filters }: { filters: IDashboardFilter[] }) => {
    // Create a set to track which filters have been rendered
    const renderedFilters = new Set<string>()
    
    return (
      <>
        {/* Render filters by group */}
        {filterGroups.map((group, groupIndex) => (
          <Box key={`group-${groupIndex}`} mb="medium">
            <Heading as="h4" mb="small">{group.groupName}</Heading>
            <Flex flexWrap="wrap" gap="small">
              {filters
                .filter((thisFilter: IDashboardFilter) => 
                  group.fieldNames.includes(thisFilter.name || '') && !renderedFilters.has(thisFilter.id)
                )
                .map(filter => {
                  // Mark filter as rendered
                  renderedFilters.add(filter.id)
                  return (
                    <FlexItem key={filter.id} width="250px">
                      {renderFilterControl(filter)}
                    </FlexItem>
                  )
                })
              }
            </Flex>
          </Box>
        ))}
        
        {/* Render remaining filters that aren't in any group */}
        {filters.some(filter => !renderedFilters.has(filter.id)) && (
          <Box mb="medium">
            <Heading as="h4" mb="small">Other Filters</Heading>
            <Flex flexWrap="wrap" gap="small">
              {filters
                .filter((filter: IDashboardFilter) => !renderedFilters.has(filter.id))
                .map(filter => (
                  <FlexItem key={filter.id} width="250px">
                    {renderFilterControl(filter)}
                  </FlexItem>
                ))
              }
            </Flex>
          </Box>
        )}
      </>
    )
  }

  return (
    <Box p="large">
      {dashboard && (
        <SpaceVertical>
          <Heading as="h1">{dashboard.title || 'Dashboard Data with Filters'}</Heading>
          
          {dashboardFilters.length > 0 && (
            <Box mb="large" p="medium" border="1px solid" borderColor="neutral-300" borderRadius="medium">
              <Form onSubmit={(e) => {
                e.preventDefault()
                applyFilters(e)
              }}>
                <Heading as="h3" mb="small">Dashboard Filters</Heading>
                {loadingSuggestions && (
                  <Box mb="small">
                    <Spinner size={20} /> Loading filter suggestions...
                  </Box>
                )}
                
                <DashboardFiltersComponent filters={dashboardFilters} />
                
                <Box mt="medium">
                  <ButtonOutline 
                    type="button" 
                    onClick={(e) => applyFilters(e)}>
                    Apply Filters
                  </ButtonOutline>
                </Box>
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
                {renderQueryData(result.data, result.elementId, result.elementTitle, result.clientId)}
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
