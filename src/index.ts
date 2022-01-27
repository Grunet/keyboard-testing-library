import {
  IKeyboardActions,
  INavigationActions,
  navigationActionNames,
  IActivationActions,
  activationActionNames,
  ILogger,
} from "./shared/interfaces";
import { LogLevel } from "./shared/enums";

import { displayDOM } from "./shared/formatter";
import { navigateTo } from "./navigateTo";
import { createDefaultLogger } from "./logger";

//Peer dependencies
import { userEvent, fireEvent } from "./shared/depsAdapter";

function __createKeyboardOnlyUserEvent() {
  let logger: ILogger = undefined;

  const navigationActions = __getDefaultNavigationActions();
  const activationActions = __getDefaultActivationActions();

  return {
    /**
     * Adjusts the verbosity of the logs emitted by the code
     * @param logLevel The desired verbosity level
     */
    setLogLevel(logLevel: `${LogLevel}`) {
      switch (logLevel) {
        case LogLevel.Off:
          logger = undefined;
          break;
        case LogLevel.Verbose:
          logger = __createVerboseLogger();
          break;
      }
    },
    /**
     * Allows for you to use your own implementations of each simulated keyboard action, replacing the defaults the library comes with
     * @param customKeyboardActions An object whose keys are the names of the specific keyboard actions you want to override,
     *                                     and whose values are (async) functions that provide an alternate implementation of that action
     */
    injectCustomShims(
      customKeyboardActions:
        | Partial<INavigationActions>
        | Partial<IActivationActions>
    ) {
      for (const navActionName of navigationActionNames) {
        const customAction = customKeyboardActions[navActionName];
        if (customAction) {
          (navigationActions[navActionName] as any) = customAction; //TS doesn't realize the exact type from the union type on either side of the assignment is going to be the same, hence the "any" crutch
        }
      }

      for (const activActionName of activationActionNames) {
        const customAction = customKeyboardActions[activActionName];
        if (customAction) {
          (activationActions[activActionName] as any) = customAction; //TS doesn't realize the exact type from the union type on either side of the assignment is going to be the same, hence the "any" crutch
        }
      }
    },
    /**
     * Attempts to navigate to the element only using keyboard actions
     *
     * Throws an error if it's unable to get to the element
     *
     * @param element A reference to the DOM element to navigate to
     */
    async navigateTo(element: Element) {
      await __navigateToAndThrowIfNotFound(element, navigationActions, logger);
    },
    /**
     * Attempts to navigate to the element only using keyboard actions, then activate it by simulating an Enter key press
     *
     * Throws an error if it's unable to get to the element
     *
     * @param element A reference to the DOM element to navigate to
     */
    async navigateToAndPressEnter(element: Element) {
      await __navigateToAndThrowIfNotFound(element, navigationActions, logger);

      await activationActions.enter(element);
    },
    /**
     * Attempts to navigate to the element only using keyboard actions, then activate it by simulating a Spacebar press
     *
     * Throws an error if it's unable to get to the element
     *
     * @param element A reference to the DOM element to navigate to
     */
    async navigateToAndPressSpacebar(element: Element) {
      await __navigateToAndThrowIfNotFound(element, navigationActions, logger);

      await activationActions.spacebar(element);
    },
  };
}

async function __navigateToAndThrowIfNotFound(
  element: Element,
  navigationActions: INavigationActions,
  logger: ILogger
) {
  const foundElement = await navigateTo(element, navigationActions, logger);

  if (!foundElement) {
    throw new Error(
      `Unable to navigate to \n\n ${displayDOM(
        element
      )} \n\n using only the keyboard`
    );
  }
}

function __getDefaultNavigationActions(): INavigationActions {
  const defaultNavigationActions = { ...testingLibShims.navigation };

  return __createProxyToDetectUndefinedActions(defaultNavigationActions);
}

function __getDefaultActivationActions(): IActivationActions {
  const defaultActivationActions = { ...testingLibShims.activation };

  return __createProxyToDetectUndefinedActions(defaultActivationActions);
}

function __createProxyToDetectUndefinedActions<
  T extends Record<string, unknown>
>(obj: T) {
  return new Proxy(obj, {
    get: function (target, prop) {
      if (typeof prop !== "string") {
        //Avoids downstream issues stemming from TS's extra caution that the property might also be a number or symbol, which it shouldn't be in practice
        throw new Error(
          "Only string-keyed objects are allowed to be proxied to detect undefined actions"
        );
      }

      const value = target[prop];

      if (!value) {
        throw new Error(
          `The "${String(
            prop
          )}" action couldn't be found. Did you install the necessary peer dependencies? Are you setting custom dependencies correctly?`
        );
      }

      return value;
    },
  });
}

function __createVerboseLogger(): ILogger {
  return createDefaultLogger();
}

const testingLibShims: IKeyboardActions = {
  navigation: {
    tab:
      userEvent &&
      (async () => {
        await userEvent.tab();
      }),
    shiftTab:
      userEvent &&
      (async () => {
        await userEvent.tab({ shift: true });
      }),
    arrowUp:
      fireEvent &&
      (async (element) => {
        fireEvent.keyDown(element, {
          key: "ArrowUp",
          code: "ArrowUp",
          keyCode: 38,
        });
      }),
    arrowRight:
      fireEvent &&
      (async (element) => {
        fireEvent.keyDown(element, {
          key: "ArrowRight",
          code: "ArrowRight",
          keyCode: 39,
        });
      }),
    arrowDown:
      fireEvent &&
      (async (element) => {
        fireEvent.keyDown(element, {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
        });
      }),
    arrowLeft:
      fireEvent &&
      (async (element) => {
        fireEvent.keyDown(element, {
          key: "ArrowLeft",
          code: "ArrowLeft",
          keyCode: 37,
        });
      }),
  },
  activation: {
    enter:
      fireEvent &&
      (async (element) => {
        fireEvent.keyDown(element, {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
        });
      }),
    spacebar:
      fireEvent &&
      (async (element) => {
        fireEvent.keyDown(element, {
          key: " ",
          code: "Space",
          keyCode: 32,
        });
      }),
  },
};

const keyboardOnlyUserEvent = __createKeyboardOnlyUserEvent();
export default keyboardOnlyUserEvent;
