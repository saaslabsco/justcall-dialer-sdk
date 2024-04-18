import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEvent,
  IsLoggedInData,
} from "../types";
import { JustCallClientEventEmitter } from "./justcall-client-event-emitter";

export class JustCallDialerEventListeners {
  private justcallClientEventEmitter: JustCallClientEventEmitter;
  private onLogin: LoginCallback;
  private onLogout: LogoutCallback;
  private awaitedListeners: Map<
    JustCallDialerEvent,
    { resolve: (value: boolean) => void; reject: () => unknown }
  > = new Map();

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

  public awaitForEvent(event: JustCallDialerEvent) {
    return new Promise((resolve, reject) => {
      this.awaitedListeners.set(event, { resolve, reject });
    });
  }

  private handleMessage = (
    event: MessageEvent<{
      name: JustCallDialerEvent;
      data:
        | LoggedInEventData
        | CallRingingEventData
        | CallAnsweredEventData
        | CallEndedEventData
        | IsLoggedInData;
    }>
  ): void => {
    const { name: eventType, data: eventData } = event.data;

    const awiatedPromise = this.awaitedListeners.get(eventType);
    if (awiatedPromise) {
      // TODO: handle retries and reject, happy case done
      awiatedPromise.resolve(eventData as IsLoggedInData);
      this.awaitedListeners.delete(eventType);
    }

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
