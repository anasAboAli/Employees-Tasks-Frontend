/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />

import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

// Intercept standard fetch calls globally to support production decoupled VITE_API_URL
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = typeof input === "string"
      ? input
      : (input instanceof URL ? input.toString() : (input as Request).url);
      
    const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    if (apiUrl && url.startsWith("/api/")) {
      url = apiUrl + url;
    }
    
    if (typeof input === "string" || input instanceof URL) {
      return originalFetch(url, init);
    } else {
      return originalFetch(new Request(url, input as any), init);
    }
  };
}

createApp(App).mount("#root");
