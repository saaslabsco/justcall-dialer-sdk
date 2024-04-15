export enum JustcallDialerErrorCode {
  invalid_event_name = "invalid_event_name",
  no_event_name = "no_event_name",
  dialer_not_ready = "dialer_not_ready",
  unknown_error = "unknown_error",
}

export class JustcallDialerError extends Error {
  constructor(public errorCode: JustcallDialerErrorCode, message?: string) {
    super(message || errorCode);
    Object.setPrototypeOf(this, JustcallDialerError.prototype);
    this.name = "JustCallJustcallDialerError";
  }
}

export const handleError = (
  errorCode: JustcallDialerErrorCode
): JustcallDialerError => {
  switch (errorCode) {
    case JustcallDialerErrorCode.invalid_event_name:
      return new JustcallDialerError(
        JustcallDialerErrorCode.invalid_event_name
      );
    case JustcallDialerErrorCode.no_event_name:
      return new JustcallDialerError(JustcallDialerErrorCode.no_event_name);
    case JustcallDialerErrorCode.dialer_not_ready:
      return new JustcallDialerError(JustcallDialerErrorCode.dialer_not_ready);
    default:
      return new JustcallDialerError(JustcallDialerErrorCode.unknown_error);
  }
};
