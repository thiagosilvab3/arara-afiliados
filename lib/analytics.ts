import { AnalyticsState } from "./types";

const ANALYTICS_KEY = "arara_analytics";

function isBrowser() {
  return typeof window !== "undefined";
}

function initialState(): AnalyticsState {
  return {
    pageViews: 0,
    checkoutStarts: 0,
    checkoutCompletions: 0,
    outboundClicks: 0,
    adminAdds: 0,
    productViews: {},
    paths: {}
  };
}

function saveAnalytics(state: AnalyticsState) {
  if (!isBrowser()) return;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("arara-analytics-updated"));
}

export function getAnalytics(): AnalyticsState {
  if (!isBrowser()) return initialState();

  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return initialState();

    const parsed = JSON.parse(raw);
    return {
      ...initialState(),
      ...parsed,
      productViews: parsed.productViews || {},
      paths: parsed.paths || {}
    };
  } catch {
    return initialState();
  }
}

export function trackEvent(
  event:
    | "page_view"
    | "product_view"
    | "checkout_start"
    | "checkout_complete"
    | "outbound_click"
    | "admin_add",
  payload?: { slug?: string; path?: string }
) {
  if (!isBrowser()) return;

  const state = getAnalytics();

  switch (event) {
    case "page_view":
      state.pageViews += 1;
      if (payload?.path) {
        state.paths[payload.path] = (state.paths[payload.path] || 0) + 1;
      }
      break;

    case "product_view":
      if (payload?.slug) {
        state.productViews[payload.slug] = (state.productViews[payload.slug] || 0) + 1;
      }
      break;

    case "checkout_start":
      state.checkoutStarts += 1;
      break;

    case "checkout_complete":
      state.checkoutCompletions += 1;
      break;

    case "outbound_click":
      state.outboundClicks += 1;
      break;

    case "admin_add":
      state.adminAdds += 1;
      break;
  }

  saveAnalytics(state);
}