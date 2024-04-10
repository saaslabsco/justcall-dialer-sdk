export type LoginCallback = (userDetails: LoggedInEventData) => void;

export type LogoutCallback = () => void;

export type JustCallDialerInitProps = {
  dialerId: string;
  onLogin: LoginCallback;
  onLogout: () => void;
};

export type CallDirection = "inbound" | "outbound";

export type LoggedInEventData = {
  logged_in: boolean;
  login_numbers: string[];
  user_info: {
    email: string;
    name: string;
  };
};

export type CallRingingEventData = {
  direction: CallDirection;
  from: string;
  to: string;
  call_sid: string;
};

export type CallAnsweredEventData = {
  call_sid: string;
  direction: CallDirection;
  answered_status: string;
};

export type CallEndedEventData = {
  call_sid: string;
  direction: CallDirection;
  duration: number;
};

export type JustCallDialerEvent =
  | "logged-in-status"
  | "call-ringing"
  | "call-answered"
  | "call-ended";

export type JustCallDialerEventWithData =
  | { name: "logged-in-status"; data: LoggedInEventData }
  | { name: "call-ringing"; data: CallRingingEventData }
  | { name: "call-answered"; data: CallAnsweredEventData }
  | { name: "call-ended"; data: CallEndedEventData };

type ExcludeLoggedInStatus<T extends string> = T extends "logged-in-status"
  ? never
  : T;

export type JustCallDialerEmittableEvent =
  ExcludeLoggedInStatus<JustCallDialerEvent>;

export type JustCallDialerEmittableEventWithData =
  | { name: "call-ringing"; data: CallRingingEventData }
  | { name: "call-answered"; data: CallAnsweredEventData }
  | { name: "call-ended"; data: CallEndedEventData };

export type JustCallClientEmitterFunc = (
  props: JustCallDialerEmittableEventWithData
) => void;
