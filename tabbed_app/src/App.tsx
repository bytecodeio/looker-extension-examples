import React, { useState } from 'react'
import { TabbedDash } from './TabbedDash'
import { ExtensionProvider } from '@looker/extension-sdk-react'

export const App: React.FC<{}> = () => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    setRoute(route)
    setRouteState(routeState)
  }

  return (
    <ExtensionProvider onRouteChange={onRouteChange}>
      <TabbedDash route={route} routeState={routeState} />
    </ExtensionProvider>
  )
}
