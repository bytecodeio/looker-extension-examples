import { LookerEmbedDashboard, LookerEmbedSDK } from '@looker/embed-sdk';
import { LookerDashboardOptions } from '@looker/embed-sdk/lib/types';
import React, { useCallback } from 'react';
import { EmbedContainer } from './components/EmbedContainer';


export const Dashboard: React.FC<any> = ({
  id,
  dashboard,
  theme,
  extensionContext,
  setDashboard,
}) => {

  const sdk = extensionContext.core40SDK

  const openExploreInNewWindow = (event: any) => {
    const db = LookerEmbedSDK.createExploreWithUrl(event.url)
    extensionContext.extensionSDK.openBrowserWindow(db.url, '_explore')
    return { cancel: !event.modal }
  }

  const canceller = (event: any) => {
    return { cancel: !event.modal }
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    const elementOptions = { elements: { 'test': { title_hidden: true } } }
    dashboard.setOptions(elementOptions as LookerDashboardOptions)
    setDashboard(dashboard)
    dashboard.setOptions(elementOptions as LookerDashboardOptions)
    
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(id as string)
        db.withTheme(theme as string)
        db.withNext('-next')
        db.appendTo(el)
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error: Error) => {
            console.error('Connection error', error)
          })
      }
    },
    [true]
  )

  return (
    <>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}
