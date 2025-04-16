import React, { useContext, useEffect, useRef, useState } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { Box, MessageBar } from '@looker/components'
import { LookerEmbedSDK } from '@looker/embed-sdk'

interface QueryEmbedProps {
  clientId: string;
  height?: string | number;
}

export const QueryEmbed: React.FC<QueryEmbedProps> = ({ 
  clientId,
  height = '400px'
}) => {
  const { extensionSDK } = useContext(ExtensionContext)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!clientId) {
      setError('No query client ID provided')
      return
    }

    const embedCtrRef = iframeRef.current
    
    if (embedCtrRef) {
      setError(null)
      
      const hostUrl = extensionSDK?.lookerHostData?.hostUrl || ''
      
      LookerEmbedSDK.init(hostUrl)
      
      try {
        // Construct the visualization URL with the full hostname
        const visualizationUrl = `${hostUrl}/embed/query-visualization/${clientId}`
        
        console.log(`Embedding visualization with URL: ${visualizationUrl}`)
        
        // Use the generic URL-based embedding approach
        LookerEmbedSDK.createDashboardWithUrl(visualizationUrl)
          .appendTo(embedCtrRef)
          .withClassName('looker-embed')
          .withSandboxAttr('allow-scripts', 'allow-same-origin', 'allow-popups')
          .on('error', (error) => {
            setError(`Error loading visualization: ${error}`)
          })
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error:', error)
            setError(`Connection error: ${error.message || 'Unknown error'}`)
          })
      } catch (err) {
        console.error('Error setting up query embed:', err)
        setError(`Error setting up query embed: ${err.message || 'Unknown error'}`)
      }
    }
    
    return () => {
      // Cleanup the embed when the component unmounts
      if (iframeRef.current) {
        iframeRef.current.innerHTML = ''
      }
    }
  }, [clientId, extensionSDK])

  if (error) {
    return <MessageBar intent="critical">{error}</MessageBar>
  }

  return (
    <Box position="relative" height={height} width="100%" border="1px solid" borderColor="neutral-300" borderRadius="medium">
      <Box ref={iframeRef} height="100%" width="100%" />
    </Box>
  )
}
