import React, { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_STAGE,
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["linkedin.com"],
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
let timeout: ReturnType<typeof setTimeout>;

function mount() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const interval = setInterval(() => {
      const sidebar = document.querySelector(".scaffold-layout__aside");

      if (sidebar) {
        clearInterval(interval);

        if (document.querySelectorAll("#outreachr-rendered").length !== 0) {
          return;
        }
        const container = document.createElement("div");

        container.id = "outreachr-rendered";

        const queryClient = new QueryClient();

        sidebar.prepend(container);
        // queryClient.invalidateQueries()
        const root = createRoot(container);

        root.render(
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={true} />
          </QueryClientProvider>,
        );
      }
    }, 100);
  }, 300);
}

function init() {
  const obs = new MutationObserver(() => {
    if (location.pathname.includes("messaging/thread/2-")) {
      mount();
    }
  });

  const titleElement = document.querySelector("title");

  if (titleElement) {
    obs.observe(titleElement, {
      childList: true,
      subtree: true,
    });
  }
}

init();
