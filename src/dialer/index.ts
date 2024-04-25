import type {
  JustCallDialerInitProps,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEmittableEvent,
  OnDialerReadyCallback,
} from "../types";
import { JustCallDialerEventListeners } from "./justcall-dialer-event-listener";
import { JustCallClientEventEmitter } from "./justcall-client-event-emitter";
import { JustCallDialerEventEmitter } from "./justcall-dialer-event-emitter";
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
  private dialerEventEmitter: JustCallDialerEventEmitter | null = null;
  private dialerReadyPromise: Promise<void>;
  private resolveDialerReadyPromise!: () => void;
  private rejectDialerReadyPromise!: () => void;

  public onLogin: LoginCallback | null = null;
  public onLogout: LogoutCallback | null = null;
  public onReady: OnDialerReadyCallback | null = null;

  public isDialerReady = false;

  public constructor(props: JustCallDialerInitProps) {
    try {
      if (typeof window === "undefined") {
        throw handleError(JustcallDialerErrorCode.browser_environment_required);
      }

      const { onLogin, onLogout, dialerId, onReady = null } = props;
      this.onLogin = onLogin;
      this.onLogout = onLogout;
      this.dialerId = dialerId;
      this.onReady = onReady;

      this.dialerReadyPromise = new Promise((resolve, reject) => {
        this.resolveDialerReadyPromise = resolve;
        this.rejectDialerReadyPromise = reject;
      });

      this.clientEventEmitter = new JustCallClientEventEmitter();
      this.init();
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }

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
        onLogin: this.onLogin!,
        onLogout: this.onLogout!,
        clientEventEmitter: this.clientEventEmitter,
      });

      this.dialerEventEmitter = new JustCallDialerEventEmitter(
        this.dialerIframe
      );

      this.dialerEventListeners.startListening();

      /* istanbul ignore next -- @preserve */
      this.dialerIframe.onload = () => {
        this.isDialerReady = true;
        if (this.onReady) this?.onReady();
        this.resolveDialerReadyPromise();
      };

      this.dialerIframe.onerror = () => {
        /* istanbul ignore next -- @preserve */
        this.rejectDialerReadyPromise();
      };
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

  public dialNumber(number: string) {
    try {
      if (!this.isDialerReady) {
        throw handleError(JustcallDialerErrorCode.dialer_not_ready);
      }
      /* istanbul ignore next -- @preserve */
      this.dialerEventEmitter!.handleExternalDial(number);
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }

  public async isLoggedIn() {
    try {
      if (!this.isDialerReady) {
        throw handleError(JustcallDialerErrorCode.dialer_not_ready);
      }
      /* istanbul ignore next -- @preserve */
      {
        this.dialerEventEmitter?.handleIsLoggedIn();
        return await this.dialerEventListeners!.awaitForEvent("is-logged-in");
      }
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }

  /* istanbul ignore next -- @preserve */
  public async ready() {
    return this.dialerReadyPromise;
  }

  public destroy() {
    try {
      this.unsubscribeAll();

      if (this.dialerIframe && this.dialerIframe.parentNode) {
        this.dialerIframe.parentNode.removeChild(this.dialerIframe);
        this.dialerIframe = null;
      }

      this.dialerDiv = null;
      this.dialerEventListeners = null;
      this.dialerEventEmitter = null;
      this.isDialerReady = false;

      this.onLogin = null;
      this.onLogout = null;
      this.onReady = null;
    } catch (error) {
      /* istanbul ignore next -- @preserve */ {
        if (error instanceof JustcallDialerError) throw error;
        throw handleError(JustcallDialerErrorCode.unknown_error);
      }
    }
  }
}
