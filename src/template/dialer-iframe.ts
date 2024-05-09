import { IFRAME_URL, IFRAME_ALLOWED_PERMISSIONS } from "../utils/contants";

export default function getJustcallDialerIframe(document: Document) {
  const iframeElement = document.createElement("iframe");

  iframeElement.src = IFRAME_URL;
  iframeElement.width = "365px";
  iframeElement.height = "610px";
  iframeElement.allow = IFRAME_ALLOWED_PERMISSIONS;

  iframeElement.style.border = "1px solid #e0e0e0";
  iframeElement.style.borderRadius = "10px";
  iframeElement.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";

  return iframeElement;
}
