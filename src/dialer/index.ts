import type {
  JustCallDialerInitProps,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEmittableEvent,
} from "../types";
import { JustCallDialerEventListeners } from "./justcall-dialer-event-listener";
import { JustCallClientEventEmitter } from "./justcall-client-event-emitter";
import dialerIframeTemplate from "../template/dialer-iframe";
import {
  handleError,
  JustcallDialerErrorCode,
  JustcallDialerError,
} from "../utils/errors";
import { validEmittableEvents } from "../utils/contants";

export class JustCallDialer {
  private dialerId: string;
  private dialerDiv: HTMLElement | null = null;
  private dialerIframe: HTMLIFrameElement | null = null;
  private dialerEventListeners: JustCallDialerEventListeners | null = null;
  private clientEventEmitter: JustCallClientEventEmitter;
  private isDialerReady = false;

  private init() {
    try {
      if (!this.dialerId) {
        throw new Error(
          "Error loading justcall dialer: dialerId is required, to initiate Justcall sdk."
        );
      }

      this.dialerDiv = document.getElementById(this.dialerId);

      if (!this.dialerDiv) {
        throw new Error(
          "Error loading justcall dialer: specified dialerId is not found."
        );
      }

      this.load();
    } catch (error) {
      if (error instanceof JustcallDialerError) throw error;
      else throw handleError(JustcallDialerErrorCode.unknown_error);
    }
  }

  private load() {
    try {
      this.dialerIframe = dialerIframeTemplate;

      this.dialerDiv?.appendChild(this.dialerIframe);

      this.dialerEventListeners = new JustCallDialerEventListeners({
        onLogin: this.onLogin,
        onLogout: this.onLogout,
        clientEventEmitter: this.clientEventEmitter,
      });

      this.dialerEventListeners.startListening();

      this.dialerIframe.onload = () => {
        this.isDialerReady = true;
      };
    } catch (error) {
      if (error instanceof JustcallDialerError) throw error;
      else throw handleError(JustcallDialerErrorCode.unknown_error);
    }
  }

  public onLogin: LoginCallback;
  public onLogout: LogoutCallback;

  public constructor(props: JustCallDialerInitProps) {
    try {
      const { onLogin, onLogout, dialerId } = props;
      this.onLogin = onLogin;
      this.onLogout = onLogout;
      this.dialerId = dialerId;
      this.clientEventEmitter = new JustCallClientEventEmitter();
      this.init();
    } catch (error) {
      if (error instanceof JustcallDialerError) throw error;
      else throw handleError(JustcallDialerErrorCode.unknown_error);
    }
  }

  public on(event: JustCallDialerEmittableEvent, callback: Function) {
    try {
      if (!event) {
        throw handleError(JustcallDialerErrorCode.no_event_name);
      }
      if (!validEmittableEvents.includes(event)) {
        throw handleError(JustcallDialerErrorCode.invalid_event_name);
      }
      this.clientEventEmitter.addDialerEventListener(event, callback);
    } catch (error) {
      if (error instanceof JustcallDialerError) throw error;
      else throw handleError(JustcallDialerErrorCode.unknown_error);
    }
  }

  public dialNumber(number: string) {
    try {
      this.clientEventEmitter.handleExternalDial(number, this.dialerIframe!);
    } catch (error) {
      if (error instanceof JustcallDialerError) throw error;
      else throw handleError(JustcallDialerErrorCode.unknown_error);
    }
  }
}
