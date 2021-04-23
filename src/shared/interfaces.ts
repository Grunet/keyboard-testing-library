interface IKeyboardActions {
  navigation: INavigationActions;
  activation: IActivationActions;
}

interface INavigationActions {
  tab: () => void;
  shiftTab: () => void;
  arrowUp: (element: Element) => void;
  arrowRight: (element: Element) => void;
  arrowDown: (element: Element) => void;
  arrowLeft: (element: Element) => void;
}

interface IActivationActions {
  enter: (element: Element) => void;
}

export { IKeyboardActions, INavigationActions, IActivationActions };
