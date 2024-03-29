import type userEvent from "@testing-library/user-event";
import type { prettyDOM } from "@testing-library/dom";
let userEventInstance: typeof userEvent = undefined;
let prettyDOMInstance: typeof prettyDOM = undefined;

//FYI - try harder at combining these into a single Promise if it becomes a bottleneck (be aware of breaking the "require" version when doing so)
try {
  const result: any = await import("@testing-library/user-event");
  //.default is used in the CJS build when directly getting back the default export from a call to "require"
  //.default.default is used in the ESM build when the "import" call wraps the underlying "require" call output with its own default export wrapping
  userEventInstance = result.default.default ?? result.default;
} catch (e) {
  console.error(e);
  console.warn(
    "Unable to find @testing-library/user-event. Proceeding without it."
  ); //TODO - consider making these customizable via the log-level or a custom logger
}

export { userEventInstance as userEvent, prettyDOMInstance as prettyDOM };
