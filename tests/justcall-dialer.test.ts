import { describe, expect, it, beforeAll, afterEach, vi } from "vitest";
import { JustCallDialer } from "../src/dialer";
import mockDialerRuntime, {
  DIALER_ID,
  NONEXISTENT_DIALER_ID,
  onLoginMock,
  onLogoutMock,
  nextTick,
  emitMockEvent,
  mockLoggedOutdata,
  mockLoginData,
} from "./utils/mock-client-runtime";

describe("Before init JustCallDialer", () => {
  it("should throw error, if dialer is not initiated in browser environment", () => {
    expect(() => {
      const dialer = new JustCallDialer({
        onLogin: onLoginMock,
        onLogout: onLogoutMock,
        dialerId: DIALER_ID,
      });
    }).toThrowError("browser_environment_required");
  });
});

describe("JustCallDialer", () => {
  beforeAll(() => {
    mockDialerRuntime();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("destroy(): cleans up resources and resets properties", () => {
    const dialer = new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });
    dialer.destroy();
    expect(dialer.isDialerReady).toBe(false);
    expect(dialer.onLogin).toBeNull();
    expect(dialer.onLogout).toBeNull();
    expect(dialer.onReady).toBeNull();
  });

  it("should throw an error if dialerId is not provided", () => {
    expect(
      () =>
        // @ts-expect-error
        new JustCallDialer({
          onLogin: onLoginMock,
          onLogout: onLogoutMock,
        })
    ).toThrowError("no_dialer_id");
  });

  it("should throw an error if Dialer DOM element is not found", () => {
    expect(() => {
      new JustCallDialer({
        dialerId: NONEXISTENT_DIALER_ID,
        onLogin: () => {},
        onLogout: () => {},
      });
    }).toThrowError("dialer_id_not_found");
  });

  it("should throw no_event_name error if no event name is passed to 'on' event listener callback", () => {
    expect(() => {
      const dialer = new JustCallDialer({
        dialerId: DIALER_ID,
        onLogin: onLoginMock,
        onLogout: onLogoutMock,
      });
      // @ts-expect-error
      dialer.on("", () => {});
    }).toThrowError("no_event_name");
  });

  it("should throw invalid_event_name error if incorrect event name is passed to 'on' event listener callback", () => {
    expect(() => {
      const dialer = new JustCallDialer({
        dialerId: DIALER_ID,
        onLogin: onLoginMock,
        onLogout: onLogoutMock,
      });
      // @ts-expect-error
      dialer.on("invalid_event_name", () => {});
    }).toThrowError("invalid_event_name");
  });

  it("should throw an error if dialNumber is called before dialer is ready", () => {
    expect(() => {
      const dialer = new JustCallDialer({
        dialerId: DIALER_ID,
        onLogin: () => {},
        onLogout: () => {},
      });
      dialer.dialNumber("+12433434334");
    }).toThrowError("dialer_not_ready");
  });

  it("should throw an error if isLoggedIn is called before dialer is ready", async () => {
    try {
      const dialer = new JustCallDialer({
        dialerId: DIALER_ID,
        onLogin: () => {},
        onLogout: () => {},
      });
      await dialer.isLoggedIn();
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain("dialer_not_ready");
    }
  });

  it("should throw an error if dialNumber is called on passing incorrect params", async () => {
    try {
      const dialer = new JustCallDialer({
        dialerId: NONEXISTENT_DIALER_ID,
        onLogin: () => {},
        onLogout: () => {},
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain("dialer_id_not_found");
    }
  });

  it("should call onLogin callback when data indicates logged_in as true", async () => {
    new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });

    emitMockEvent("logged-in-status", mockLoginData);

    await nextTick();

    expect(onLoginMock).toHaveBeenCalledWith(mockLoginData);
    expect(onLogoutMock).not.toHaveBeenCalled();
  });

  it("should call onLogout callback when data indicates logged_in as false", async () => {
    new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });

    emitMockEvent("logged-in-status", mockLoggedOutdata);

    await nextTick();

    expect(onLoginMock).not.toHaveBeenCalled();
    expect(onLogoutMock).toHaveBeenCalled();
  });
});
