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
    const listener = this.dialerEventListeners.get(event.name);
    if (listener) {
      listener(event.data);
    } else {
      throw new Error("Not listening to this event: " + event.name);
    }
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
    console.log("Handling logged-in-status event:", data);
    if (data.logged_in) {
      onLogin(data);
    } else {
      onLogout();
    }
  }

  public handleCallRinging(data: CallRingingEventData): void {
    console.log("Handling call-ringing event:", data);
    this.emit({ name: "call-ringing", data });
  }

  public handleCallAnswered(data: CallAnsweredEventData): void {
    console.log("Handling call-answered event:", data);
    this.emit({ name: "call-answered", data });
  }

  public handleCallEnded(data: CallEndedEventData): void {
    console.log("Handling call-ended event:", data);
    this.emit({ name: "call-ended", data });
  }
}
