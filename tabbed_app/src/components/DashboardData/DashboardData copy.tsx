import React, { useContext, useEffect, useState } from 'react'
import { ExtensionContext, ExtensionContextData } from '@looker/extension-sdk-react'
import { Box, Heading, Spinner, MessageBar, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableDataCell, SpaceVertical } from '@looker/components'
import { IDashboard, IDashboardElement } from '@looker/sdk'

interface DashboardDataProps {
  dashboardId: string
}

interface QueryResult {
  elementId: string;
  elementTitle: string;
  data: string;
}

export const DashboardData: React.FC<DashboardDataProps> = ({ dashboardId }) => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK
  
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<IDashboard | null>(null)
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get dashboard details
        const dashboardData = await sdk.ok(sdk.dashboard(dashboardId))
        setDashboard(dashboardData as IDashboard)
        
        // Process each dashboard element with a query_id
        const results: QueryResult[] = []
        
        for (const element of dashboardData.dashboard_elements || []) {
          if (element.query_id) {
            try {
              const queryData = await sdk.ok(sdk.run_query({
                query_id: element.query_id,
                result_format: 'json'
              }))
              
              results.push({
                elementId: element.id || '',
                elementTitle: element.title || 'Untitled Element',
                data: queryData
              })
            } catch (queryError) {
              console.error(`Error fetching query ${element.query_id}:`, queryError)
            }
          }
        }
        
        setQueryResults(results)
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

  if (loading) {
    return (
      <Box p="large" display="flex" justifyContent="center" alignItems="center">
        <Spinner size={50} />
      </Box>
    )
  }

  if (error) {
    return <MessageBar intent="critical">{error}</MessageBar>
  }

  return (
    <Box p="large">
      {dashboard && (
        <SpaceVertical>
          <Heading as="h1">{dashboard.title || 'Dashboard Data'}</Heading>
          
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
