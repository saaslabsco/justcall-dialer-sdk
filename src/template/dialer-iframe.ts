import { IFRAME_URL, IFRAME_ALLOWED_PERMISSIONS } from "../utils/contants";

const parser = new DOMParser();
const iframeElement = parser.parseFromString(
  `<iframe src="${IFRAME_URL}" width="350px" height="610px" allow="${IFRAME_ALLOWED_PERMISSIONS}"></iframe>`,
  "text/html"
).body.firstChild as HTMLIFrameElement;

export default iframeElement;
