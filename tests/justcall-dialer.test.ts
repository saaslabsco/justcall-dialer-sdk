import { describe, expect, it } from "vitest";
import { JustCallDialer } from "../src/dialer";
import { JSDOM } from "jsdom";

describe("JustCallDialer", () => {
  const { window } = new JSDOM();
  globalThis.document = window.document;
  globalThis.window = window as unknown as Window & typeof globalThis;

  const mockDialerDiv = document.createElement("div");
  mockDialerDiv.id = "justcall-dialer";
  document.body.appendChild(mockDialerDiv);

  it("should throw an error if dialerId is not provided", () => {
    // @ts-expect-error
    expect(() => new JustCallDialer({})).toThrowError("dialerId is required");
  });

  it("should throw an error if Dialer DOM element is not found", () => {
    expect(() => {
      new JustCallDialer({
        dialerId: "nonexistent-dialer",
        onLogin: () => {},
        onLogout: () => {},
      });
    }).toThrowError("Error loading justcall dialer");
  });

  it("should handle onLogin and onLogout callbacks", () => {
    const onLoginMock = function (data) {
      console.log("Mocked onLogin function called with data: ", data);
    };
    const onLogoutMock = function () {
      console.log("Mocked onLogout function called");
    };

    const dialer = new JustCallDialer({
      dialerId: "justcall-dialer",
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
        dialerId: "justcall-dialer-incorrect-id",
        onLogin: () => {},
        onLogout: () => {},
      });
      dialer.dialNumber("+1234567890");
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain("Error loading justcall dialer");
    }
  });
});
