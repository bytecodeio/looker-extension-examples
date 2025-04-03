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
  Flex
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
  }, [dashboardId, sdk])
  
  const executeQueries = async (bodies: any[], filters: FilterState) => {
    setLoading(true)
    
    try {
      const results: QueryResult[] = []
      
      for (const item of bodies) {
        try {
          // Apply any active filters to the query body
          const queryBody = { ...item.queryBody }
          
          // Update filters in the query
          Object.keys(filters).forEach(filterName => {
            const filterValue = filters[filterName]
            if (filterValue && filterValue !== '') {
              // Find the corresponding dashboard filter to get the dimension
              const dashFilter = dashboardFilters.find(df => df.name === filterName)
              if (dashFilter && dashFilter.dimension) {
                queryBody.filters[dashFilter.dimension] = filterValue.toString()
              }
            }
          })
          
          // Run the inline query
          const queryData = await sdk.ok(sdk.run_inline_query({
            body: queryBody,
            result_format: 'json'
          }))
          
          results.push({
            elementId: item.elementId || '',
            elementTitle: item.elementTitle || 'Untitled Element',
            data: queryData
          })
        } catch (queryError) {
          console.error(`Error running inline query for element ${item.elementId}:`, queryError)
        }
      }
      
      setQueryResults(results)
    } catch (err) {
      console.error('Error executing queries:', err)
      setError(`Failed to execute queries: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  const handleFilterChange = (filterName: string, value: string | boolean | string[]) => {
    const newFilterState = {
      ...filterState,
      [filterName]: value
    }
    setFilterState(newFilterState)
  }
  
  const applyFilters = () => {
    executeQueries(queryBodies, filterState)
  }
  
  // Render filter controls based on filter type
  const renderFilterControl = (filter: IDashboardFilter) => {
    const filterType = filter.field?.type || 'string'
    const currentValue = filterState[filter.name]
    
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
      default:
        // For simplicity, using a text field for all string filters
        // In a real app, you might want to use different controls based on ui_config
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
              <Form>
                <Heading as="h3" mb="small">Dashboard Filters</Heading>
                <Flex flexWrap="wrap" gap="medium">
                  {dashboardFilters.map(filter => (
                    <FlexItem key={filter.id} width="250px">
                      {renderFilterControl(filter)}
                    </FlexItem>
                  ))}
                  <FlexItem alignSelf="flex-end">
                    <ButtonOutline onClick={applyFilters}>
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
