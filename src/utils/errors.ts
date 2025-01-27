/* istanbul ignore file -- @preserve */

export enum JustcallDialerErrorCode {
  no_dialer_id = "no_dialer_id",
  dialer_id_not_found = "dialer_id_not_found",
  invalid_event_name = "invalid_event_name",
  no_event_name = "no_event_name",
  dialer_not_ready = "dialer_not_ready",
  not_subscribed_to_event = "not_subscribed_to_event",
  browser_environment_required = "browser_environment_required",
  sdk_internal_error = "sdk_internal_error",
  unknown_error = "unknown_error",
}

export class JustcallDialerError extends Error {
  constructor(public errorCode: JustcallDialerErrorCode, message?: string) {
    super(`${errorCode}${message ? `: ${message}` : ""}`);
    Object.setPrototypeOf(this, JustcallDialerError.prototype);
    this.name = "JustCallJustcallDialerError";
  }
}

export const handleError = (
  errorCode: JustcallDialerErrorCode,
  message?: string
): JustcallDialerError => {
  switch (errorCode) {
    case JustcallDialerErrorCode.no_dialer_id:
      return new JustcallDialerError(
        JustcallDialerErrorCode.no_dialer_id,
        "Dialer id is required to initiate justcall-dialer-sdk"
      );
    case JustcallDialerErrorCode.dialer_id_not_found:
      return new JustcallDialerError(
        JustcallDialerErrorCode.dialer_id_not_found
      );
    case JustcallDialerErrorCode.invalid_event_name:
      return new JustcallDialerError(
        JustcallDialerErrorCode.invalid_event_name
      );
    case JustcallDialerErrorCode.no_event_name:
      return new JustcallDialerError(JustcallDialerErrorCode.no_event_name);
    case JustcallDialerErrorCode.not_subscribed_to_event:
      return new JustcallDialerError(
        JustcallDialerErrorCode.not_subscribed_to_event
      );
    case JustcallDialerErrorCode.dialer_not_ready:
      return new JustcallDialerError(JustcallDialerErrorCode.dialer_not_ready);
    case JustcallDialerErrorCode.browser_environment_required:
      return new JustcallDialerError(
        JustcallDialerErrorCode.browser_environment_required
      );
    case JustcallDialerErrorCode.sdk_internal_error:
      return new JustcallDialerError(
        JustcallDialerErrorCode.sdk_internal_error,
        message
      );
    default:
      return new JustcallDialerError(JustcallDialerErrorCode.unknown_error);
  }
};
