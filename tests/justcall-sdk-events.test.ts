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

  beforeAll(() => {
    mockDialerRuntime();
    dialer = new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });
  });

  it("should listen to the event, call the earlier passed callbacks emitted by iframe", async () => {
    dialer.on("call-ringing", onCallRingingMock);
    dialer.on("call-answered", onCallAnsweredMock);
    dialer.on("call-ended", onCallEndedMock);

    await nextTick();

    emitMockEvent("call-ringing");
    emitMockEvent("call-answered");
    emitMockEvent("call-ended");

    await nextTick();

    expect(onCallRingingMock).toHaveBeenCalledOnce();
    expect(onCallAnsweredMock).toHaveBeenCalledOnce();
    expect(onCallEndedMock).toHaveBeenCalledOnce();

    dialer.unsubscribeAll();
  });

  it("should only be able to unsubscribe from event, it has already subscribed to", () => {
    expect(() => {
      dialer.on("call-answered", onCallAnsweredMock);
      dialer.unsubscribe("call-ended");
    }).toThrowError("not_subscribed_to_event");

    try {
      dialer.on("call-answered", onCallAnsweredMock);
      dialer.unsubscribe("call-answered");
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
