import {
  Box,
  Tab2,
  Tabs2,
  Dialog,
  DialogContent,
  IconButton,
  Heading,
  SpaceVertical,
  MessageBar,
  Paragraph,
  Button,
  Spinner,
} from '@looker/components'

import { LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  IDashboard,
  IDashboardElement,
  IRequestCreateDashboardRenderTask,
} from '@looker/sdk'
import {
  ExtensionContext,
  ExtensionContextData,
  getCore40SDK,
} from '@looker/extension-sdk-react'
import React, { useCallback, useContext, useEffect } from 'react'
import styled, { css } from 'styled-components'

import { Dashboard } from './Dashboard'
import { EmbedProps } from './types'
import { Configure } from '../Configure/Configure'
import _ from 'lodash'
import { BsGear } from 'react-icons/bs'

import * as XLSX from 'xlsx'

export const EmbedDashboard: React.FC<EmbedProps> = ({
  dashboards,
  configurationData,
  updateConfigurationData,
  isAdmin,
}) => {
  const [running, setRunning] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const [tabId, setTabId] = React.useState('0')
  const sdk = getCore40SDK()
  const configIconLocation = {
    position: 'absolute' as 'absolute',
    right: '1em',
    top: '1em',
    zIndex: 999,
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const handleSelectedTab = (index: string) => {
    setTabId(index)
  }

  const prepareData = (data) => {
    const itemField = {}
    Object.keys(data).forEach((label) => {
      const splitLabel = label.split('.')
      const actualLabel = splitLabel[splitLabel.length - 1] || ''
      itemField[actualLabel] = data[label]
    })
    return itemField
  }

  const prepareWorksheet = (
    element: IDashboardElement | any,
    dashboard: IDashboard
  ) =>
    new Promise((resolve, reject) => {
      sdk
        .ok(
          sdk.run_query({
            query_id: element.query_id,
            result_format: 'json',
          })
        )
        .then((query_data: any) => {

          const sheetData = query_data.map((item) => prepareData(item))
          
          const ws = XLSX.utils.json_to_sheet(sheetData)

          const sheetname = `${dashboard.title} - ${element.title}`
          resolve({ [sheetname]: ws })
        })
        .catch(reject)
    })
  const createWorkBook = async (dashboard: IDashboard | any) => {
    const elements = await sdk.ok(
      sdk.search_dashboard_elements({ dashboard_id: dashboard.id })
    )
    const sheets = await Promise.all(
      elements.map((e) => prepareWorksheet(e, dashboard))
    )
    const sheetList: any = sheets.reduce(
      (a: any, b: any) => ({ ...a, [Object.keys(b)[0]]: b }),
      {}
    )
    const workbook = XLSX.utils.book_new()
    return {
      Title: dashboard.title,
      WorkBook: workbook,
      Sheets: sheetList,
      SheetNames: Object.keys(sheetList),
    }
  }

  const getDashboard = async (sdk: any, dashboards: any) => {
    setLoading(true)
    !loading &&
      Promise.all(dashboards.map(createWorkBook))
        .then((wb) => {
          const workbook = {
            Title: wb.map( (w) => w.Title ).filter(Boolean).join('_').replace(/\s\s+/g, '_'),
            SheetNames: wb
              .map((b) => b.SheetNames)
              .reduce((a, b) => [...a, ...b], []),
            Sheets: wb
              .map((s) => s.Sheets)
              .reduce(
                (a, b) => ({
                  ...a,
                  ...Object.keys(b).reduce((x, y) => ({ ...x, ...b[y] }), {}),
                }),
                {}
              ),
          }
          !loading && downloadFeature(workbook)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
  }

  const downloadFeature = (workbook) => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const data = new Blob([excelBuffer], { type: fileType })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    const download_filename: string = configurationData.defaultFileName.replace('.xlsx','') || workbook.Title
    link.setAttribute('download', download_filename + '.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    setLoading(false)
  }

  return (
    <>
      {configurationData.dashboards.length == 0 && (
        <Box m="large">
          <SpaceVertical>
            <Heading>Welcome to the Tabbed Dashboards Extension</Heading>

            <Paragraph>
              Please configure dashboards with the configuration icon at the
              right of the page.
            </Paragraph>
          </SpaceVertical>
        </Box>
      )}

      {configurationData.dashboards.length > 0 && (
        <Tabs2
          tabId={tabId}
          onTabChange={(index) => handleSelectedTab(index.toString())}
        >
          {configurationData.dashboards.map(({ title }, index) => {
            return (
              <Tab2 key={index.toString()} id={index.toString()} label={title}>
                <Dashboard
                  key={index.toString()}
                  id={configurationData.dashboards[index]['id']}
                  running={running}
                  theme={configurationData.theme}
                  extensionContext={extensionContext}
                  setDashboard={setupDashboard}
                />
              </Tab2>
            )
          })}
        </Tabs2>
      )}
      {isAdmin ? (
        <div style={configIconLocation}>
          <Dialog
            content={
              <DialogContent>
                <Configure
                  configurationData={configurationData}
                  updateConfigurationData={updateConfigurationData}
                />
              </DialogContent>
            }
          >
            <IconButton
              icon={<BsGear />}
              label="Configure Dashboards"
              size="medium"
            />
          </Dialog>
          <Button
            onClick={() => getDashboard(sdk, configurationData.dashboards)}
          >
            Download{loading && <Spinner color="white" size={25} />}
          </Button>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
