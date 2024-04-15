import { JSDOM } from "jsdom";
import {
  JustCallDialerEventWithData,
  JustCallDialerEvent,
  LoggedInEventData,
} from "../../src/types";
import { vi } from "vitest";

export const mockLoginData = {
  logged_in: true,
  login_numbers: ["+1234567890"],
  user_info: {
    email: "himanshu@saaslabs.co",
    name: "Himanshu Bhardwaz",
  },
};

export const mockLoggedOutdata = {
  logged_in: false,
  login_numbers: ["+1234567890"],
  user_info: {
    email: "himanshu@saaslabs.co",
    name: "Himanshu Bhardwaz",
  },
};

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
  eventName: JustCallDialerEvent,
  data?: LoggedInEventData
) {
  let eventData: JustCallDialerEventWithData | null = null;

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
    case "logged-in-status": {
      if (data) {
        eventData = {
          name: "logged-in-status",
          data,
        };
      }
      break;
    }

    default:
      console.error("Invalid event name:", eventName);
      return;
  }

  if (eventData) {
    globalThis.window.postMessage(eventData, "*");
  }
}

export const onLoginMock = vi.fn((data) => {
  console.log("Mocked onLogin function called with data: ", data);
});

export const onLogoutMock = vi.fn(() => {
  console.log("Mocked onLogout function called");
});

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
