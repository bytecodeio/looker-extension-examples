// This component allows the user to input a URL and then embeds that URL in an iframe.
// The URL is stored in the extension context so that it persists across dashboard sessions.
// The URL can be udpated when in dashbaord edit mode.
import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  ComponentsProvider,
  FieldText,
  Heading,
} from "@looker/components";
import { ExtensionContext } from "@looker/extension-sdk-react"

export const EmbedIframe = () => {
  // Get the tileHostData and extensionSDK from the ExtensionContext
  const { tileHostData, extensionSDK, visualizationSDK } = useContext(ExtensionContext);

  const [site, setSite] = useState();
  // letsGo is a flag that determines whether to show the input form or the iframe
  const [letsGo, setLetsGo] = useState(false);
  const [contextData, setContextData] = useState({});

  // Fetch the context data when the component mounts
  useEffect(() => {
    const fetchContextData = async () => {
      let initialContextData = await extensionSDK.getContextData();
      
      if (initialContextData) {
        setContextData(initialContextData);
        // If the contextData contains an entry for the current elementId, set the site and letsGo flag
        if (initialContextData[tileHostData.elementId]) {
          setSite(initialContextData[tileHostData.elementId]?.site);
          setLetsGo(true);
        }
      }
    };
    if (extensionSDK && tileHostData && tileHostData.elementId) fetchContextData();
    // Only fetch context data when the component mounts
  }, [tileHostData, extensionSDK, visualizationSDK ]);

  const handleSubmit = async () => {
    // TODO: Store state in context
    const newContextData = { elementId: tileHostData.elementId, site: site };
    // Add or update the context data for the current elementId
    contextData[newContextData.elementId] = newContextData;
    // Save the updated context data
    extensionSDK.saveContextData(contextData);
    // lets GOOOOOOOO! ;)
    setLetsGo(true);
  }

  return (
    <>
      {(!letsGo || tileHostData.isDashboardEditing) && (
        <ComponentsProvider>
          <Heading>Looker HTML Embedding</Heading>
          <Heading as="h4">
            Configure a site to embed
          </Heading>
          <FieldText
            name="embedSite"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
          <Button onClick={handleSubmit}>Embed</Button>
        </ComponentsProvider>
      )}
      {letsGo && (
        <iframe src={site} width="100%" height="1000px"></iframe>
      )}
    </>
  );
};
