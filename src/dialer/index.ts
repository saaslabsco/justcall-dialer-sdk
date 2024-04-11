import type {
  JustCallDialerInitProps,
  LoginCallback,
  LogoutCallback,
  JustCallDialerEmittableEvent,
} from "../types";
import { JustCallDialerEventListeners } from "./event-listener";
import { IFRAME_URL, IFRAME_ALLOWED_PERMISSIONS } from "../contants";
import { JustCallClientEventEmitter } from "./event-emitter";

export class JustCallDialer {
  private dialerId: string;
  private dialerDiv: HTMLElement | null = null;
  private dialerIframe: HTMLIFrameElement | null = null;
  private dialerEventListeners: JustCallDialerEventListeners | null = null;
  private clientEventEmitter: JustCallClientEventEmitter;

  private load() {
    if (!this.dialerId) {
      throw new Error(
        "Error loading justcall dialer: dialerId is required, to initiate Justcall sdk"
      );
    }

    this.dialerDiv = document.getElementById(this.dialerId);

    if (!this.dialerDiv) {
      throw new Error(
        "Error loading justcall dialer: Dialer DOM element is not found"
      );
    }

    this.dialerIframe = document.createElement("iframe");
    this.dialerIframe.src = IFRAME_URL;
    this.dialerIframe.width = "100%";
    this.dialerIframe.height = "100%";
    this.dialerIframe.allow = IFRAME_ALLOWED_PERMISSIONS;

    this.dialerDiv.appendChild(this.dialerIframe);

    this.dialerEventListeners = new JustCallDialerEventListeners({
      onLogin: this.onLogin,
      onLogout: this.onLogout,
      clientEventEmitter: this.clientEventEmitter,
    });

    this.dialerEventListeners.startListening();
  }

  public onLogin: LoginCallback;
  public onLogout: LogoutCallback;

  public constructor(props: JustCallDialerInitProps) {
    const { onLogin, onLogout, dialerId } = props;
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this.dialerId = dialerId;
    this.clientEventEmitter = new JustCallClientEventEmitter();
    this.load();
  }

  public on(event: JustCallDialerEmittableEvent, callback: Function) {
    this.clientEventEmitter.addDialerEventListener(event, callback);
  }

  public dialNumber(number: string) {
    if (!this.dialerIframe) {
      throw new Error(
        "Error loading justcall dialer: Could not post message, pls specify correct dialerId."
      );
    }
    this.clientEventEmitter.handleExternalDial(number, this.dialerIframe);
  }

  public getDialerIframe() {
    return this.dialerIframe;
  }

  public getWindow() {
    return window;
  }
}
