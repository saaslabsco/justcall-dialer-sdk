export class JustCallDialerEventEmitter {
  private dialerIframe: HTMLIFrameElement;

  constructor(iframe: HTMLIFrameElement) {
    this.dialerIframe = iframe;
  }

  public handleExternalDial(phoneNumber: string): void {
    this.dialerIframe.contentWindow?.postMessage(
      {
        type: "dial-number",
        phoneNumber,
      },
      "https://app.justcall.io"
    );
  }

  public handleIsLoggedIn() {
    this.dialerIframe.contentWindow?.postMessage(
      {
        type: "is-logged-in",
      },
      "https://app.justcall.io"
    );
  }
}
