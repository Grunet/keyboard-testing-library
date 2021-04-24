import { ILogger } from "./shared/interfaces";

function createDefaultLogger(): ILogger {
  return {
    capturePath(path) {
      console.log(path);
    },
    captureCurrentElement(curEl) {
      console.log(`${curEl.outerHTML}`);
    },
  };
}

export { createDefaultLogger };
