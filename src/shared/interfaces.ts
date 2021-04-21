interface IKeyboardActions {
  navigation: INavigationActions;
}

interface INavigationActions {
  tab: () => void;
  shiftTab: () => void;
  arrowUp: (element: Element) => void;
  arrowRight: (element: Element) => void;
  arrowDown: (element: Element) => void;
  arrowLeft: (element: Element) => void;
}

export { IKeyboardActions, INavigationActions };
