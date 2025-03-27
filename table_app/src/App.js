/**
 * This is a sample Looker Extension written in typescript and React. It imports one component, <HelloWorld>.
 * HelloWorld makes a simple call to the Looker API using the Extension Framework's built in authentication,
 * and returns the logged in user.
 */
import React from "react";
import { ExtensionProvider } from "@looker/extension-sdk-react";
import { hot } from "react-hot-loader/root";
import "./App.css";

import { Framework } from "./Framework";

export const App = hot(() => (
  <ExtensionProvider>
    <Framework />
  </ExtensionProvider>
));
