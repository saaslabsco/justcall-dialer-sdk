export const DIALER_TO_IFRAME_EVENT_PREFIX = "jc-dialer-";
export const IFRAME_TO_CLIENT_EVENT_PREFIX = "jc-app-";
export const IFRAME_URL = "https:/app.justcall.io/app/macapp/dialpad_app_v5";
export const IFRAME_ALLOWED_PERMISSIONS =
  "microphone; autoplay; clipboard-read; clipboard-write; hid";

export const validEmittableEvents = [
  "call-ringing",
  "call-answered",
  "call-ended",
] as const;

export const privateEvents = [
  "logged-in-status",
  "is-logged-in",
  "oauth-sdk-communication-token",
] as const;

export const validEvents = [...validEmittableEvents, ...privateEvents] as const;

export const isLoggedIn = ["true", "false"] as const;

export const callDirections = ["inbound", "outbound"] as const;

export const firebaseConfig = {
  apiKey: "AIzaSyBY671pKhD83rRwOTXX24uExnFtEh8I3dU",
  authDomain: "justcall-production-two.firebaseapp.com",
  projectId: "justcall-production-two",
  storageBucket: "justcall-production-two.firebasestorage.app",
  messagingSenderId: "360469603946",
  appId: "1:360469603946:web:94b213175f4092a3af0c13",
  measurementId: "G-15VWVB6CXG",
};
