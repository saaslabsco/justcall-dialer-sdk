import {
  validEmittableEvents,
  validEvents,
  callDirections,
} from "./utils/contants";

export type LoginCallback = (userDetails: LoggedInEventData) => void;

export type LogoutCallback = () => void;

export type JustCallDialerInitProps = {
  dialerId: string;
  onLogin: LoginCallback;
  onLogout: () => void;
};

export type CallDirection = (typeof callDirections)[number];

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

type EventDataType = {
  "logged-in-status": LoggedInEventData;
  "call-ringing": CallRingingEventData;
  "call-answered": CallAnsweredEventData;
  "call-ended": CallEndedEventData;
};

type EventWithData<EventName extends keyof EventDataType> =
  EventName extends keyof EventDataType
    ? { name: EventName; data: EventDataType[EventName] }
    : never;

export type JustCallDialerEvent = (typeof validEvents)[number];

export type JustCallDialerEventWithData = {
  [EventName in keyof EventDataType]: EventWithData<EventName>;
}[keyof EventDataType];

export type JustCallDialerEmittableEvent =
  (typeof validEmittableEvents)[number];

export type JustCallDialerEmittableEventWithData = Exclude<
  JustCallDialerEventWithData,
  EventWithData<"logged-in-status">
>;

export type JustCallClientEmitterFunc = (
  props: JustCallDialerEmittableEventWithData
) => void;
