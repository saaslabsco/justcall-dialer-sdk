import { IFRAME_URL, IFRAME_ALLOWED_PERMISSIONS } from "../utils/contants";

// TODO - simple fix for now, will expore later
export default function getJustcallDialerIframe(document: Document) {
  const iframeElement = document.createElement("iframe");

  iframeElement.src = IFRAME_URL;
  iframeElement.width = "350px";
  iframeElement.height = "610px";
  iframeElement.allow = IFRAME_ALLOWED_PERMISSIONS;

  return iframeElement;
}
