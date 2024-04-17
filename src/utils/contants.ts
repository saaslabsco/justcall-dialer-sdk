export const DIALER_TO_IFRAME_EVENT_PREFIX = "jc-dialer-";
export const IFRAME_TO_CLIENT_EVENT_PREFIX = "jc-app-";
export const IFRAME_URL =
  "https://app.justcall.io/dialer";
export const IFRAME_ALLOWED_PERMISSIONS =
  "microphone; autoplay; clipboard-read; clipboard-write; hid";

export const validEmittableEvents = [
  "call-ringing",
  "call-answered",
  "call-ended",
] as const;

export const validEvents = [
  ...validEmittableEvents,
  "logged-in-status",
] as const;

export const callDirections = ["inbound", "outbound"] as const;
