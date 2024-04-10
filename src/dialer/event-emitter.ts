import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  JustCallClientEmitterFunc,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
} from "../types";

export class JustCallClientEventEmitter {
  protected emitter: JustCallClientEmitterFunc;

  constructor(emitter: JustCallClientEmitterFunc) {
    this.emitter = emitter;
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
    this.emitter({ name: "call-ringing", data });
  }

  public handleCallAnswered(data: CallAnsweredEventData): void {
    console.log("Handling call-answered event:", data);
    this.emitter({ name: "call-answered", data });
  }

  public handleCallEnded(data: CallEndedEventData): void {
    console.log("Handling call-ended event:", data);
    this.emitter({ name: "call-ended", data });
  }
}
