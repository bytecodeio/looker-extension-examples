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

interface DashboardDataWithFiltersProps {
  dashboardId: string
}

interface QueryResult {
  elementId: string
  elementTitle: string
  data: any[]
  clientId?: string
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
  const [chartPreferences, setChartPreferences] = useState<Record<string, string>>({})
  const [autoSelectChartType, setAutoSelectChartType] = useState<boolean>(true)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const dashboardData = await sdk.ok(sdk.dashboard(dashboardId))
        setDashboard(dashboardData as IDashboard)
        
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
  }, [dashboardId])
  
  const fetchFilterSuggestions = async (filters: IDashboardFilter[]) => {
    setLoadingSuggestions(true)
    const suggestions: FilterSuggestions = {}
    
    try {
      const suggestionPromises = filters
        .filter(filter => filter.field?.type === 'string' && filter.dimension)
        .map(async (filter) => {
          try {
            const [view, field] = filter?.field?.suggest_dimension?.split('.') || []
            const model = filter?.model 
            if (!model || !view || !field) return null
            
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
      
      const results = await Promise.all(suggestionPromises)
      results
        .filter(Boolean)
        .forEach(result => {
          if (result) {
            suggestions[result.name] = result.values
          }
        })
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
      
      const queryPromises = bodies.map(async (item) => {
        try {
          const queryBody = { ...item.queryBody }
          
          Object.keys(filters).forEach(filterName => {
            const filterValue = filters[filterName]
            if (filterValue && filterValue !== '') {
              const dashFilter = dashboardFilters.find(df => df.name === filterName)
              if (dashFilter && dashFilter.dimension) {
                queryBody.filters[dashFilter.dimension] = filterValue.toString()
              }
            }
          })
          
          const result = await sdk.ok(sdk.run_inline_query({
            body: queryBody,
            result_format: 'json'
          }))
          
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
      
      const results = await Promise.all(queryPromises)
      
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
    const newFilterState = {
      ...filterState,
      [filterName]: value
    }
    setFilterState(newFilterState)
  }
  
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
