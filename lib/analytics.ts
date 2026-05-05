export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "checkout_start"
  | "lead_submit"
  | "affiliate_click";

type TrackEventPayload = {
  slug?: string;
  path?: string;
};

export async function trackEvent(
  eventName: AnalyticsEventName,
  payload: TrackEventPayload = {}
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        ...payload,
      }),
    });
  } catch {
    // silencia erro de analytics para não quebrar UX
  }
}