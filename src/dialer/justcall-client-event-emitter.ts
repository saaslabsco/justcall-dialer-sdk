import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  JustCallDialerEmittableEvent,
  JustCallDialerEmittableEventWithData,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
} from "../types";

export class JustCallClientEventEmitter {
  private dialerEventListeners: Map<JustCallDialerEmittableEvent, Function> =
    new Map();

  private emit(event: JustCallDialerEmittableEventWithData) {
    const listener = this.dialerEventListeners.get(event.name)!;
    listener(event.data);
  }

  public addDialerEventListener(
    event: JustCallDialerEmittableEvent,
    callback: Function
  ) {
    this.dialerEventListeners.set(event, callback);
  }

  public handleLoggedIn(
    data: LoggedInEventData,
    onLogin: LoginCallback,
    onLogout: LogoutCallback
  ): void {
    if (data.logged_in) {
      onLogin(data);
    } else {
      onLogout();
    }
  }

  public handleCallRinging(data: CallRingingEventData): void {
    this.emit({ name: "call-ringing", data });
  }

  public handleCallAnswered(data: CallAnsweredEventData): void {
    this.emit({ name: "call-answered", data });
  }

  public handleCallEnded(data: CallEndedEventData): void {
    this.emit({ name: "call-ended", data });
  }

  public handleExternalDial(
    phoneNumber: string,
    dialerIframe: HTMLIFrameElement
  ): void {
    dialerIframe.contentWindow?.postMessage(
      {
        type: "dial-number",
        phoneNumber,
      },
      "https://app.justcall.io"
    );
  }
}
