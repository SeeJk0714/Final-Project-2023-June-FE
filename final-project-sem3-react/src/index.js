import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <ModalsProvider>
                    <App />
                    <Notifications />
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>
);
