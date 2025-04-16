import React, { createContext, useContext, useState, useEffect } from 'react';

interface EchartsContextType {
  isLoaded: boolean;
  reload: () => void;
}

const EchartsContext = createContext<EchartsContextType>({
  isLoaded: false,
  reload: () => {}
});

export const useEcharts = () => useContext(EchartsContext);

export const EchartsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  // Check if echarts is loaded and not a shim
  const checkEchartsLoaded = () => {
    return window.echarts && !window.echarts._isShim;
  };

  // Function to reload all echarts components
  const reload = () => {
    setLoadCount(prev => prev + 1);
  };

  useEffect(() => {
    // Check if echarts is already loaded
    if (checkEchartsLoaded()) {
      setIsLoaded(true);
    }

    // Listen for the custom event from index.tsx
    const handleEchartsLoaded = () => {
      setIsLoaded(true);
      reload();
    };

    window.addEventListener('echartsloaded', handleEchartsLoaded);

    return () => {
      window.removeEventListener('echartsloaded', handleEchartsLoaded);
    };
  }, []);

  return (
    <EchartsContext.Provider value={{ isLoaded, reload }}>
      {children}
    </EchartsContext.Provider>
  );
};