import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEvent,
} from "../types";
import { JustCallClientEventEmitter } from "./justcall-client-event-emitter";

export class JustCallDialerEventListeners {
  private justcallClientEventEmitter: JustCallClientEventEmitter;
  private onLogin: LoginCallback;
  private onLogout: LogoutCallback;

  constructor({
    onLogin,
    onLogout,
    clientEventEmitter,
  }: {
    onLogin: LoginCallback;
    onLogout: LogoutCallback;
    clientEventEmitter: JustCallClientEventEmitter;
  }) {
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this.justcallClientEventEmitter = clientEventEmitter;
  }

  public startListening() {
    window.addEventListener("message", this.handleMessage);
  }

  private handleMessage = (
    event: MessageEvent<{
      name: JustCallDialerEvent;
      data:
        | LoggedInEventData
        | CallRingingEventData
        | CallAnsweredEventData
        | CallEndedEventData;
    }>
  ): void => {
    const { name: eventType, data: eventData } = event.data;

    switch (eventType) {
      case "logged-in-status":
        this.justcallClientEventEmitter.handleLoggedIn(
          eventData as LoggedInEventData,
          this.onLogin,
          this.onLogout
        );
        break;
      case "call-ringing":
        this.justcallClientEventEmitter.handleCallRinging(
          eventData as CallRingingEventData
        );
        break;
      case "call-answered":
        this.justcallClientEventEmitter.handleCallAnswered(
          eventData as CallAnsweredEventData
        );
        break;
      case "call-ended":
        this.justcallClientEventEmitter.handleCallEnded(
          eventData as CallEndedEventData
        );
        break;
    }
  };
}
