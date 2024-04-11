import { JSDOM } from "jsdom";
import {
  JustCallDialerEmittableEventWithData,
  JustCallDialerEmittableEvent,
} from "../../src/types";
import { vi } from "vitest";

export const DIALER_ID = "justcall-dialer";
export const NONEXISTENT_DIALER_ID = "nonexistent-dialer";

export default function mockClientRuntime() {
  const { window } = new JSDOM();
  globalThis.document = window.document;
  globalThis.window = window as unknown as Window & typeof globalThis;

  const mockDialerDiv = document.createElement("div");
  mockDialerDiv.id = DIALER_ID;
  document.body.appendChild(mockDialerDiv);
}

export function emitMockEvent(
  dialerWindow: Window | null,
  eventName: JustCallDialerEmittableEvent
) {
  if (!dialerWindow) throw new Error("Didnt get dialer iframe element");
  let eventData: JustCallDialerEmittableEventWithData | null = null;

  switch (eventName) {
    case "call-ringing":
      eventData = {
        name: "call-ringing",
        data: {
          direction: "inbound",
          from: "Caller's Number",
          to: "Receiver's Number",
          call_sid: "12345",
        },
      };
      break;
    case "call-answered":
      eventData = {
        name: "call-answered",
        data: {
          call_sid: "12345",
          direction: "outbound",
          answered_status: "answered",
        },
      };
      break;
    case "call-ended":
      eventData = {
        name: "call-ended",
        data: {
          call_sid: "12345",
          direction: "inbound",
          duration: 60,
        },
      };
      break;
    default:
      console.error("Invalid event name:", eventName);
      return;
  }

  if (eventData) {
    dialerWindow.postMessage(eventData, "*");
  }
}

export const onLoginMock = function (data) {
  console.log("Mocked onLogin function called with data: ", data);
};

export const onLogoutMock = function () {
  console.log("Mocked onLogout function called");
};

export const onCallRingingMock = vi.fn(async (data) => {
  console.log("Mocked onCallRinging called with data: ", data);
});

export const onCallAnsweredMock = vi.fn(async (data) => {
  console.log("Mocked onCallAnswered called with data: ", data);
});

export const onCallEndedMock = vi.fn(async (data) => {
  console.log("Mocked onCallEnded called with data: ", data);
});

export function nextTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
