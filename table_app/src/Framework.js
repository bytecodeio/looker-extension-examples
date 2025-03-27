import React, { useContext, useEffect, useState } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { CustomTable } from "./components/CustomTable";
import { config } from "process";

/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const Framework = () => {
  const {visualizationSDK, visualizationData, extensionSDK} = useContext(ExtensionContext);
  const queryResponse = visualizationData?.queryResponse;
  const visConfig = visualizationData?.visConfig;


  return (
    <>
      {queryResponse &&
        <Visualization 
          queryResponse={queryResponse}
          visConfig={visConfig}
          visualizationSDK={visualizationSDK}
          extensionSDK={extensionSDK}
        />
      }

    </>
  );
};

const Visualization = ({queryResponse,visConfig,visualizationSDK,extensionSDK}) => {

  useEffect(() => {
    let _options = {
      chartTitle: {
        type: "string",
        label: "Chart Title",
        default: "",
        section: "Chart",
        order: 1
      },
      columnOrder: {
        type:"array",
        label:"Column Order",
        default: visConfig?.columnOrder,
        display: "text",
        section: "Chart",
        order: 2
      }
    }

    const dimensionKeys = queryResponse?.fields.dimension_like || [];
    const measureKeys = queryResponse?.fields.measure_like || [];
    const fields = dimensionKeys.concat(measureKeys);
    let order = 1;
    fields?.map((field) => {
      _options[`divider_${field.name}`] = {
        type: "string",
        label: `${field.label_short} Section`,
        display: "divider",
        section: "Columns",
        order: order
      }
      order++
      _options[`name_${field.name}`] = {
        type: "string",
        label: `${field.label_short} Override`,
        default: field.label_short,
        display: "text",
        section: "Columns",
        order: order
      }
      order++;
      _options[`subheader_${field.name}`] = {
        type: "string",
        label: `Sub Header to Show`,
        default: "",
        display: "text",
        section: "Columns",
        order: order
      }
      order++;
      _options[`width_${field.name}`] = {
        type: "number",
        label: `Column Width`,
        default: 200,
        display: "range",
        section: "Columns",
        min:140,
        max:400,
        order: order
      }
      order++;
      _options[`freeze_${field.name}`] = {
        type: "boolean",
        label: `Freeze Column`,
        default: false,
        section: "Columns",
        order: order
      }
      order++;
    })
    visualizationSDK.configureVisualization(_options)
    console.log("new options", _options)
    
    extensionSDK.updateTitle()
    visualizationSDK.configureVisualization(_options);
    visualizationSDK.setVisConfig(visConfig)
    extensionSDK.rendered()
  },[])

  const updateColumnOrder = (order) => {
    if (queryResponse?.parent_id) {
      let _config = {}
      _config = visConfig;
      _config['columnOrder'] = order
      visualizationSDK.setVisConfig(_config)
      extensionSDK.rendered()
    }
  }

  const updateColumnFreeze = (key, value) => {
    if (queryResponse?.parent_id) {
      let _config = {}
      _config = visConfig;
      _config[`freeze_${key}`] = value
      visualizationSDK.setVisConfig(_config)
      extensionSDK.rendered()
    }
  }


  return (
    <>
      {queryResponse &&
        <CustomTable 
          data={queryResponse?.data}
          config={visConfig}
          queryResponse={queryResponse}
          updateColumnOrder={updateColumnOrder}
          updateColumnFreeze={updateColumnFreeze}
        />
      }

    </>
  );
}
