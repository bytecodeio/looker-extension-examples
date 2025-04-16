import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { useEcharts } from './EchartsContext';

// This component wraps ReactEcharts to ensure it only renders when echarts is loaded
export const EchartsWrapper = (props: any) => {
  const { isLoaded } = useEcharts();
  const [key, setKey] = useState(0);
  
  // Force re-render when echarts is loaded
  useEffect(() => {
    if (isLoaded) {
      setKey(prev => prev + 1);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <div className="loading-chart">Chart loading...</div>;
  }

  // Key ensures the component is completely remounted when echarts loads
  return <ReactEcharts key={key} {...props} />;
};
