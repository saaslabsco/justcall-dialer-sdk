import { describe, expect, it, beforeAll, afterEach, vi } from "vitest";
import { JustCallDialer } from "../src/dialer";
import mockDialerRuntime, {
  DIALER_ID,
  NONEXISTENT_DIALER_ID,
  onLoginMock,
  onLogoutMock,
  nextTick,
  emitMockEvent,
} from "./utils/mock-client-runtime";

describe("JustCallDialer", () => {
  beforeAll(() => {
    mockDialerRuntime();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if dialerId is not provided", () => {
    // @ts-expect-error
    expect(() => new JustCallDialer({})).toThrowError("dialerId is required");
  });

  it("should throw an error if Dialer DOM element is not found", () => {
    expect(() => {
      new JustCallDialer({
        dialerId: NONEXISTENT_DIALER_ID,
        onLogin: () => {},
        onLogout: () => {},
      });
    }).toThrowError("Error loading justcall dialer");
  });

  it("should handle onLogin and onLogout callbacks", () => {
    const dialer = new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });

    // Simulate login
    dialer.onLogin({
      logged_in: true,
      login_numbers: ["+1234567890"],
      user_info: {
        email: "himanshu@saaslabs.co",
        name: "Himanshu Bhardwaz",
      },
    });
    // Simulate logout
    dialer.onLogout();
  });

  it("should throw an error if dialNumber is called on passing incorrect params", () => {
    try {
      const dialer = new JustCallDialer({
        dialerId: NONEXISTENT_DIALER_ID,
        onLogin: () => {},
        onLogout: () => {},
      });
      dialer.dialNumber("+1234567890");
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain(
        "Error loading justcall dialer: specified dialerId is not found."
      );
    }
  });

  it("should call onLogin callback when data indicates logged_in as true", async () => {
    const data = {
      logged_in: true,
      login_numbers: ["+1234567890"],
      user_info: {
        email: "himanshu@saaslabs.co",
        name: "Himanshu Bhardwaz",
      },
    };

    const dialer = new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });

    emitMockEvent("logged-in-status", data);

    await nextTick();

    expect(onLoginMock).toHaveBeenCalledWith(data);
    expect(onLogoutMock).not.toHaveBeenCalled();
  });

  it("should call onLogout callback when data indicates logged_in as false", async () => {
    const data = {
      logged_in: false,
      login_numbers: ["+1234567890"],
      user_info: {
        email: "himanshu@saaslabs.co",
        name: "Himanshu Bhardwaz",
      },
    };

    const dialer = new JustCallDialer({
      dialerId: DIALER_ID,
      onLogin: onLoginMock,
      onLogout: onLogoutMock,
    });

    emitMockEvent("logged-in-status", data);

    await nextTick();

    expect(onLoginMock).not.toHaveBeenCalled();
    expect(onLogoutMock).toHaveBeenCalled();
  });
});
