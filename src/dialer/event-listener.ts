export enum JustCallDialerEvents {
  "LOGGED_IN" = "logged_in",
  "CALL_RINGING" = "call-ringing",
  "CALL_ANSWERED" = "call-answered",
  "CALL_ENDED" = "call-ended",
}

export class JustCallDialerEventListeners {
  private dialerIframe: HTMLIFrameElement;

  constructor(dialerIframe: HTMLIFrameElement) {
    this.dialerIframe = dialerIframe;
  }

  public startListening() {}
}
