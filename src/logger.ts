import { ILogger } from "./shared/interfaces";

import { displayDOM } from "./shared/formatter";

function createDefaultLogger(): ILogger {
  return {
    capturePath(path) {
      console.log(path);
    },
    captureCurrentElement(curEl) {
      console.log(`${displayDOM(curEl)}`);
    },
  };
}

export { createDefaultLogger };
