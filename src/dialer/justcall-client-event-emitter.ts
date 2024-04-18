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

import { JustcallDialerErrorCode, handleError } from "../utils/errors";

export class JustCallClientEventEmitter {
  private dialerEventListeners: Map<JustCallDialerEmittableEvent, Function> =
    new Map();

  private emit(event: JustCallDialerEmittableEventWithData) {
    const listener = this.dialerEventListeners.get(event.name);
    /* istanbul ignore if -- @preserve */
    if (listener) {
      listener(event.data);
    }
  }

  public addDialerEventListener(
    event: JustCallDialerEmittableEvent,
    callback: Function
  ) {
    this.dialerEventListeners.set(event, callback);
  }

  public unsubscribeFromDialerEvent(event: JustCallDialerEmittableEvent) {
    if (this.dialerEventListeners.has(event)) {
      this.dialerEventListeners.delete(event);
    } else throw handleError(JustcallDialerErrorCode.not_subscribed_to_event);
  }

  public unsubscribeAll() {
    this.dialerEventListeners.clear();
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
}
