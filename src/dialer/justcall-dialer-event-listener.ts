import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEvent,
  IsLoggedInData,
  SMSReceivedEventData,
} from "../types";
import { JustCallClientEventEmitter } from "./justcall-client-event-emitter";

export class JustCallDialerEventListeners {
  private justcallClientEventEmitter: JustCallClientEventEmitter;
  private onLogin: LoginCallback | null = null;
  private onLogout: LogoutCallback | null = null;
  private awaitedListeners: Map<
    JustCallDialerEvent,
    { resolve: (value: boolean) => void; reject: (reason?: unknown) => void }
  > = new Map();

  constructor({
    onLogin,
    onLogout,
    clientEventEmitter,
  }: {
    onLogin: LoginCallback | null;
    onLogout: LogoutCallback | null;
    clientEventEmitter: JustCallClientEventEmitter;
  }) {
    if (onLogin) this.onLogin = onLogin;
    if (onLogout) this.onLogout = onLogout;
    this.justcallClientEventEmitter = clientEventEmitter;
  }

  public startListening() {
    window.addEventListener("message", this.handleMessage);
  }

  /* istanbul ignore next -- @preserve */
  public awaitForEvent(event: JustCallDialerEvent) {
    return new Promise<boolean>((resolve, reject) => {
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
        | SMSReceivedEventData
        | IsLoggedInData;
    }>
  ): void => {
    const { name: eventType, data: eventData } = event.data;

    const awiatedPromise = this.awaitedListeners.get(eventType);

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
      case "sms-received":
        this.justcallClientEventEmitter.handleSMSReceived(
          eventData as SMSReceivedEventData
        );
        break;
      case "is-logged-in": {
        /* istanbul ignore next -- @preserve */ {
          if (awiatedPromise) {
            const isLoggedInBool = eventData === "true";
            awiatedPromise.resolve(isLoggedInBool);
            this.awaitedListeners.delete(eventType);
          }
          break;
        }
      }
    }
  };
}
