import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import {BrowserRouter}  from "react-router-dom";
import { brandPurple } from "./theme.ts";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  </React.StrictMode>
);
