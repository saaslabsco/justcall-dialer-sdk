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
  protected dialerId: string;
  protected dialerDiv: HTMLElement | null = null;
  protected dialerIframe: HTMLIFrameElement | null = null;
  protected dialerEventListeners: JustCallDialerEventListeners | null = null;
  protected clientEventEmitter: JustCallClientEventEmitter;

  public onLogin: LoginCallback;
  public onLogout: LogoutCallback;

  public constructor(props: JustCallDialerInitProps) {
    const { onLogin, onLogout, dialerId } = props;
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this.dialerId = dialerId;
    this.clientEventEmitter = new JustCallClientEventEmitter();
  }

  public on(event: JustCallDialerEmittableEvent, callback: Function) {
    this.clientEventEmitter.addDialerEventListener(event, callback);
  }

  public load() {
    if (!this.dialerId) {
      throw new Error("dialerId is required, to initiate Justcall sdk");
    }

    this.dialerDiv = document.getElementById(this.dialerId);

    if (!this.dialerDiv) {
      throw new Error("Dialer DOM element is not found");
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
}
