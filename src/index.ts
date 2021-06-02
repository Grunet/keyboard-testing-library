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
    navigateTo(element: Element) {
      __navigateToAndThrowIfNotFound(element, navigationActions, logger);
    },
    navigateToAndPressEnter(element: Element) {
      __navigateToAndThrowIfNotFound(element, navigationActions, logger);

      activationActions.enter(element);
    },
    navigateToAndPressSpacebar(element: Element) {
      __navigateToAndThrowIfNotFound(element, navigationActions, logger);

      activationActions.spacebar(element);
    },
  };
}

function __navigateToAndThrowIfNotFound(
  element: Element,
  navigationActions: INavigationActions,
  logger: ILogger
) {
  const foundElement = navigateTo(element, navigationActions, logger);

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
      (() => {
        userEvent.tab();
      }),
    shiftTab:
      userEvent &&
      (() => {
        userEvent.tab({ shift: true });
      }),
    arrowUp:
      fireEvent &&
      ((element) => {
        fireEvent.keyDown(element, {
          key: "ArrowUp",
          code: "ArrowUp",
          keyCode: 38,
        });
      }),
    arrowRight:
      fireEvent &&
      ((element) => {
        fireEvent.keyDown(element, {
          key: "ArrowRight",
          code: "ArrowRight",
          keyCode: 39,
        });
      }),
    arrowDown:
      fireEvent &&
      ((element) => {
        fireEvent.keyDown(element, {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
        });
      }),
    arrowLeft:
      fireEvent &&
      ((element) => {
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
      ((element) => {
        fireEvent.keyDown(element, {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
        });
      }),
    spacebar:
      fireEvent &&
      ((element) => {
        fireEvent.keyDown(element, {
          key: " ",
          code: "Space",
          keyCode: 32,
        });
      }),
  },
};

const keyboardOnlyUserEvent = __createKeyboardOnlyUserEvent();
export { keyboardOnlyUserEvent };
