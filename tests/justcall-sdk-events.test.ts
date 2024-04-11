import { describe, beforeAll, it, expect, vi } from "vitest";
import mockDialerRuntime, {
  DIALER_ID,
  onLoginMock,
  onLogoutMock,
  emitMockEvent,
  onCallAnsweredMock,
  onCallEndedMock,
  onCallRingingMock,
  nextTick,
} from "./utils/mock-client-runtime";
import { JustCallDialer } from "../src/dialer";

describe("JustCallDialerEventListeners", () => {
  let dialer: JustCallDialer;
  let dialerWindow: Window | null;

  beforeAll(() => {
    mockDialerRuntime();
    dialer = new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });

    dialer.on("call-ringing", onCallRingingMock);
    dialer.on("call-answered", onCallAnsweredMock);
    dialer.on("call-ended", onCallEndedMock);
  });

  it("should listen to the event, call the earlier passed callbacks emitted by iframe", async () => {
    emitMockEvent("call-ringing");
    emitMockEvent("call-answered");
    emitMockEvent("call-ended");

    await nextTick();

    expect(onCallRingingMock).toHaveBeenCalledOnce();
    expect(onCallAnsweredMock).toHaveBeenCalledOnce();
    expect(onCallEndedMock).toHaveBeenCalledOnce();
  });

  it("should be able to emit dial-number event", () => {
    try {
      const number = "123456789";
      dialer.dialNumber(number);
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
