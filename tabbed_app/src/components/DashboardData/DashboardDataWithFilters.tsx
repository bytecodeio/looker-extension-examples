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
      
      const results = await Promise.all(queryPromises)
      
      const successfulResults = results
        .filter(result => result.success)
        .map(({ elementId, elementTitle, data }) => ({
          elementId,
          elementTitle,
          data
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
  
  const determineChartType = (data: any[], elementTitle: string): string => {
    const customConfig = getChartConfigByTitle(elementTitle)
    if (customConfig) {
      return customConfig.type
    }

    if (!autoSelectChartType && chartPreferences[elementTitle]) {
      return chartPreferences[elementTitle]
    }

    if (!data || data.length === 0) return 'table'
    
    const columns = Object.keys(data[0])
    if (columns.length < 2) return 'table'
    
    const dateColumnPattern = /date|time|year|month|day|quarter|week/i
    const hasDateColumn = columns.some(column => 
      dateColumnPattern.test(column) || 
      (typeof data[0][column] === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data[0][column]))
    )
    
    const numericColumns = columns.filter(column => 
      typeof data[0][column] === 'number' || 
      (!isNaN(parseFloat(data[0][column])) && 
       !column.toLowerCase().includes('id') &&
       !column.toLowerCase().endsWith('_id'))
    )
    
    const dimensionColumns = columns.filter(column => 
      column.toLowerCase().includes('name') || 
      column.toLowerCase().includes('category') ||
      column.toLowerCase().includes('type') ||
      column.toLowerCase().includes('segment')
    )
    
    if (hasDateColumn && numericColumns.length >= 1) {
      return 'line'
    } else if (data.length >= 10 && numericColumns.length >= 1) {
      return 'bar'
    } else if (data.length <= 10 && numericColumns.length === 1 && dimensionColumns.length >= 1) {
      return 'pie'
    } else if (numericColumns.length >= 2) {
      return 'scatter'
    } else if (numericColumns.length >= 1) {
      return 'bar'
    }
    
    return 'table'
  }
  
  const generateChartOptions = (data: any[], chartType: string, elementTitle: string): any => {
    if (!data || data.length === 0) return {}
    
    const customConfig = getChartConfigByTitle(elementTitle)
    if (customConfig) {
      if (customConfig.customRenderer) {
        const dynamicConfig = customConfig.customRenderer(data)
        if (dynamicConfig) {
          return mergeDeep(
            { ...customConfig.options }, 
            dynamicConfig
          )
        }
      }
      return customConfig.options
    }
    
    const columns = Object.keys(data[0])
    
    let dimensionColumn = columns[0]
    
    const dimensionCandidates = columns.filter(col => 
      /name|category|type|segment|region|country|state|city|product|date|time|year|month|day/i.test(col)
    )
    
    if (dimensionCandidates.length > 0) {
      if (chartType === 'line') {
        const dateColumns = dimensionCandidates.filter(col => 
          /date|time|year|month|day|quarter|week/i.test(col)
        )
        dimensionColumn = dateColumns.length > 0 ? dateColumns[0] : dimensionCandidates[0]
      } else {
        dimensionColumn = dimensionCandidates[0]
      }
    }
    
    const measureColumns = columns.filter(col => 
      (typeof data[0][col] === 'number' || !isNaN(parseFloat(data[0][col]))) &&
      !col.toLowerCase().includes('id') &&
      !col.toLowerCase().endsWith('_id')
    )
    
    const dimensions = data.map(item => {
      const value = item[dimensionColumn]
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.split('T')[0]
      }
      return value
    })
    
    const theme = {
      colors: [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', 
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
      ],
      title: {
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        }
      },
      grid: {
        containLabel: true,
        left: '3%',
        right: '4%',
        bottom: '3%'
      },
      tooltip: {
        confine: true,
        textStyle: {
          fontSize: 12
        }
      }
    }
    
    switch(chartType) {
      case 'line':
        return {
          title: { text: elementTitle || 'Trend Analysis' },
          tooltip: { 
            trigger: 'axis',
            formatter: (params: any) => {
              let result = `${params[0].name}<br/>`
              params.forEach((param: any) => {
                result += `${param.seriesName}: ${param.value}<br/>`
              })
              return result
            }
          },
          legend: { 
            data: measureColumns,
            type: 'scroll',
            bottom: 0
          },
          grid: { ...theme.grid, bottom: 30 },
          xAxis: {
            type: 'category',
            data: dimensions,
            axisLabel: {
              rotate: dimensions.length > 10 ? 45 : 0,
              hideOverlap: true
            }
          },
          yAxis: { type: 'value' },
          series: measureColumns.map((measure, index) => ({
            name: measure,
            type: 'line',
            data: data.map(item => item[measure]),
            smooth: true,
            itemStyle: {
              color: theme.colors[index % theme.colors.length]
            }
          }))
        }
        
      case 'bar':
        return {
          title: { text: elementTitle || 'Comparison' },
          tooltip: { 
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          legend: { 
            data: measureColumns,
            type: 'scroll',
            bottom: 0
          },
          grid: { ...theme.grid, bottom: 30 },
          xAxis: {
            type: 'category',
            data: dimensions,
            axisLabel: {
              rotate: dimensions.length > 8 ? 45 : 0,
              hideOverlap: true,
              interval: dimensions.length > 12 ? 'auto' : 0
            }
          },
          yAxis: { type: 'value' },
          series: measureColumns.map((measure, index) => ({
            name: measure,
            type: 'bar',
            data: data.map(item => item[measure]),
            itemStyle: {
              color: theme.colors[index % theme.colors.length]
            }
          }))
        }
        
      case 'pie':
        const measureColumn = measureColumns[0] || columns[1]
        return {
          title: { text: elementTitle || 'Distribution' },
          tooltip: { 
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)' 
          },
          legend: {
            type: 'scroll',
            orient: 'horizontal',
            bottom: 0,
            data: dimensions
          },
          series: [{
            name: measureColumn,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: data.map((item, index) => ({ 
              value: item[measureColumn], 
              name: item[dimensionColumn],
              itemStyle: { color: theme.colors[index % theme.colors.length] }
            }))
          }]
        }
        
      case 'scatter':
        const xColumn = measureColumns[0]
        const yColumn = measureColumns[1]
        return {
          title: { text: elementTitle || 'Correlation' },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              const dataIndex = params.dataIndex
              const point = data[dataIndex]
              const dimensionValue = point[dimensionColumn]
              return `${dimensionValue}<br/>${xColumn}: ${point[xColumn]}<br/>${yColumn}: ${point[yColumn]}`
            }
          },
          xAxis: {
            type: 'value',
            name: xColumn,
            nameLocation: 'middle',
            nameGap: 30
          },
          yAxis: {
            type: 'value',
            name: yColumn
          },
          series: [{
            type: 'scatter',
            data: data.map(item => [item[xColumn], item[yColumn]]),
            symbolSize: 10
          }]
        }
        
      default:
        return {}
    }
  }
  
  const mergeDeep = (target: any, source: any) => {
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj)
    
    if (!isObject(target) || !isObject(source)) {
      return source
    }
    
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
    
    return target
  }
  
  const handleChartTypeChange = (elementTitle: string, chartType: string) => {
    setChartPreferences(prev => ({
      ...prev,
      [elementTitle]: chartType
    }))
  }
  
  const renderQueryData = (data: any[], elementId: string, elementTitle: string) => {
    if (!data || data.length === 0) return <Box>No data available</Box>
    
    const chartType = determineChartType(data, elementTitle)
    const chartOptions = generateChartOptions(data, chartType, elementTitle)
    
    const chartTypes = ['bar', 'line', 'pie', 'scatter', 'table']
    const customConfig = getChartConfigByTitle(elementTitle)
    
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
                {renderQueryData(result.data, result.elementId, result.elementTitle)}
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
