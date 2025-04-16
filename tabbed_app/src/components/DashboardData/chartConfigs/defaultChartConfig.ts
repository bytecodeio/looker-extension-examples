import { ChartConfig } from './index'

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

export const determineChartType = (data: any[], elementTitle: string): string => {
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

export const generateChartOptions = (data: any[], chartType: string, elementTitle: string): any => {
  if (!data || data.length === 0) return {}
  
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

export const mergeDeep = (target: any, source: any) => {
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
