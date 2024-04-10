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
