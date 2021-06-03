import { importModuleDynamically } from "./moduleLoaderAdapter";

import type userEvent from "@testing-library/user-event";
import type { fireEvent, prettyDOM } from "@testing-library/dom";
let userEventInstance: typeof userEvent = undefined;
let fireEventInstance: typeof fireEvent = undefined;
let prettyDOMInstance: typeof prettyDOM = undefined;

//FYI - try harder at combining these into a single Promise if it becomes a bottleneck (be aware of breaking the "require" version when doing so)
try {
  ({ default: userEventInstance } = await importModuleDynamically(
    "@testing-library/user-event"
  ));
} catch (e) {
  if (!e.code?.includes("MODULE_NOT_FOUND")) {
    throw e;
  }

  console.warn(
    "Unable to find @testing-library/user-event. Proceeding without it."
  ); //TODO - consider making these customizable via the log-level or a custom logger
}

try {
  ({
    fireEvent: fireEventInstance,
    prettyDOM: prettyDOMInstance,
  } = await importModuleDynamically("@testing-library/dom"));
} catch (e) {
  if (!e.code?.includes("MODULE_NOT_FOUND")) {
    throw e;
  }

  console.warn("Unable to find @testing-library/dom. Proceeding without it.");
}

export {
  userEventInstance as userEvent,
  fireEventInstance as fireEvent,
  prettyDOMInstance as prettyDOM,
};
