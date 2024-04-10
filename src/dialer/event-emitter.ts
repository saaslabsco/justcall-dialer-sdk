import {
  CallAnsweredEventData,
  CallEndedEventData,
  CallRingingEventData,
  LoggedInEventData,
  LoginCallback,
  LogoutCallback,
} from "../types";

export class JustCallClientEventEmitter {
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
  }

  public handleCallAnswered(data: CallAnsweredEventData): void {
    console.log("Handling call-answered event:", data);
  }

  public handleCallEnded(data: CallEndedEventData): void {
    console.log("Handling call-ended event:", data);
  }
}
