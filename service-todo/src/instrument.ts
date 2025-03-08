import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node"
import { getConfig } from "./config";

const config = getConfig();

// we don't want to start the monitoring if we don't have the dns
if (config.monitoring.dns) {
  Sentry.init({
    dsn: config.monitoring.dns,
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });
} else {
  console.warn("No monitoring dns found, skipping monitoring setup");
}
