import { ILogger } from "./shared/interfaces";

import { displayDOM } from "./shared/formatter";

function createDefaultLogger(): ILogger {
  return {
    capturePath(path) {
      console.debug(path);
    },
    captureCurrentElement(curEl) {
      console.debug(`${displayDOM(curEl)}`);
    },
  };
}

export { createDefaultLogger };
