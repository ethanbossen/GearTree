import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import {BrowserRouter}  from "react-router-dom";
import { brandPurple } from "./theme.ts";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider
    theme={{colors: {brand: brandPurple,
    },
    primaryColor: "brand",
    fontFamily: "JetBrains Mono, monospace"
    }}
    defaultColorScheme="light">
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
