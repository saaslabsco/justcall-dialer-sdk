import type { JustCallDialerInitProps, LoginCallback } from "../types";

export class JustCallDialer {
  private dialerId: string;
  private dialerDiv: HTMLElement | null = null;
  private dialerIframe: HTMLIFrameElement | null = null;

  public onLogin: LoginCallback;
  public onLogout: () => void;

  public constructor(props: JustCallDialerInitProps) {
    const { onLogin, onLogout, dialerId } = props;
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this.dialerId = dialerId;
  }

  public load() {
    if (!this.dialerId) {
      throw new Error("dialerId is required, to initiate Justcall sdk");
    }

    this.dialerDiv = document.getElementById(this.dialerId);

    if (!this.dialerDiv) {
      throw new Error("Dialer DOM element is not found");
    }

    this.dialerIframe = document.createElement("iframe");
    this.dialerIframe.src = "https://app.justcall.io/app/macapp/dialer_events";
    this.dialerIframe.width = "100%";
    this.dialerIframe.height = "100%";

    this.dialerDiv.appendChild(this.dialerIframe);
  }
}

const dialer = new JustCallDialer({
  dialerId: "",
  onLogin: (setting) => {},
  onLogout: () => {},
});
