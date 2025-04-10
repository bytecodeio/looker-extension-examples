import { ChartConfig } from './index'

export const exploresInUseConfig: ChartConfig = {
  type: 'pie',
  dimensionField: 'explore.name', // The field to use as dimension (categories)
  measureFields: ['explore.count'], // The fields to use as measures (values)
  
  options: {
    backgroundColor: '#f8f8f8',
    title: {
      text: 'Explores in Use',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      bottom: 10,
      data: [], // Will be populated dynamically
      textStyle: {
        color: '#333'
      }
    },
    series: [{
      name: 'Explore Usage',
      type: 'pie',
      radius: ['35%', '70%'], // Donut chart
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c} ({d}%)'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: true
      },
      data: [] // Will be populated dynamically
    }]
  },
  
  // Custom renderer function to transform the data for this specific chart
  customRenderer: (data: any[]) => {
    // Ensure we have the required fields
    if (!data.length || !('explore.name' in data[0]) || !('explore.count' in data[0])) {
      return null;
    }
    
    // Extract legend data (unique explore names)
    const legends = [...new Set(data.map(item => item['explore.name']))];
    
    // Create data items
    const seriesData = data.map(item => ({
      name: item['explore.name'],
      value: item['explore.count']
    }));
    
    // Return updated configuration
    return {
      legend: { data: legends },
      series: [{
        name: 'Explore Usage',
        data: seriesData
      }]
    };
  }
};
