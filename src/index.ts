import { IKeyboardActions } from "./shared/interfaces";
import { navigateTo } from "./navigateTo";

//Peer dependencies
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom"; //TODO - will this crash when the dependency isn't available?

function __createKeyboardOnlyUserEvent() {
  const keyboardActions = __getDefaultKeyboardActions();

  return {
    injectCustomShims(customKeyboardActions: Partial<IKeyboardActions>) {
      Object.assign(keyboardActions, customKeyboardActions);
    },
    navigateTo(element: Element) {
      const foundElement = navigateTo(element, keyboardActions);

      if (!foundElement) {
        throw new Error(
          `Unable to navigate to ${element.outerHTML} using only the keyboard`
        );
      }
    },
  };
}

function __getDefaultKeyboardActions(): IKeyboardActions {
  const defaultKeyboardActions = { ...testingLibShims };

  return new Proxy(defaultKeyboardActions, {
    get: function (target, prop) {
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

const testingLibShims: IKeyboardActions = {
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
};

const keyboardOnlyUserEvent = __createKeyboardOnlyUserEvent();
export { keyboardOnlyUserEvent };
