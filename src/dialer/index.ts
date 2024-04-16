import type {
  JustCallDialerInitProps,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEmittableEvent,
} from "../types";
import { JustCallDialerEventListeners } from "./justcall-dialer-event-listener";
import { JustCallClientEventEmitter } from "./justcall-client-event-emitter";
import getJustcallDialerIframeTempl from "../template/dialer-iframe";
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
  // private isDialerReady = false;

  private init() {
    if (!this.dialerId) {
      throw handleError(JustcallDialerErrorCode.no_dialer_id);
    }

    this.dialerDiv = document.getElementById(this.dialerId);

    if (!this.dialerDiv) {
      throw handleError(JustcallDialerErrorCode.dialer_id_not_found);
    }

    this.load();
  }

  private load() {
    try {
      this.dialerIframe = getJustcallDialerIframeTempl(document);

      this.dialerDiv?.appendChild(this.dialerIframe!);

      this.dialerEventListeners = new JustCallDialerEventListeners({
        onLogin: this.onLogin,
        onLogout: this.onLogout,
        clientEventEmitter: this.clientEventEmitter,
      });

      this.dialerEventListeners.startListening();
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
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
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
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
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }

  public dialNumber(number: string) {
    try {
      this.clientEventEmitter.handleExternalDial(number, this.dialerIframe!);
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }

  public unsubscribe(event: JustCallDialerEmittableEvent) {
    try {
      this.clientEventEmitter.unsubscribeFromDialerEvent(event);
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }

  public unsubscribeAll() {
    try {
      this.clientEventEmitter.unsubscribeAll();
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }
}
