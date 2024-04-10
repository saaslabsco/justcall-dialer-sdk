import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
} from "../types";
import { JustCallClientEventEmitter } from "./event-emitter";

export enum JustCallDialerEvents {
  LOGGED_IN = "logged-in-status",
  CALL_RINGING = "call-ringing",
  CALL_ANSWERED = "call-answered",
  CALL_ENDED = "call-ended",
}

export class JustCallDialerEventListeners {
  private justcallClientEventEmitter: JustCallClientEventEmitter;
  private onLogin: LoginCallback;
  private onLogout: LogoutCallback;

  constructor({
    onLogin,
    onLogout,
  }: {
    onLogin: LoginCallback;
    onLogout: LogoutCallback;
  }) {
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this.justcallClientEventEmitter = new JustCallClientEventEmitter();
  }

  public startListening() {
    window.addEventListener("message", this.handleMessage);
  }

  private handleMessage = (
    event: MessageEvent<{
      name: JustCallDialerEvents;
      data:
        | LoggedInEventData
        | CallRingingEventData
        | CallAnsweredEventData
        | CallEndedEventData;
    }>
  ): void => {
    const { name: eventType, data: eventData } = event.data;

    switch (eventType) {
      case JustCallDialerEvents.LOGGED_IN:
        this.justcallClientEventEmitter.handleLoggedIn(
          eventData as LoggedInEventData,
          this.onLogin,
          this.onLogout
        );
        break;
      case JustCallDialerEvents.CALL_RINGING:
        this.justcallClientEventEmitter.handleCallRinging(
          eventData as CallRingingEventData
        );
        break;
      case JustCallDialerEvents.CALL_ANSWERED:
        this.justcallClientEventEmitter.handleCallAnswered(
          eventData as CallAnsweredEventData
        );
        break;
      case JustCallDialerEvents.CALL_ENDED:
        this.justcallClientEventEmitter.handleCallEnded(
          eventData as CallEndedEventData
        );
        break;
    }
  };
}
