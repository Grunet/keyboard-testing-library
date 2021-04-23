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

/* Hack to export an iterable list of the interface's property names */

//None of the following would be necessary were it possible to iterate over the interface's property names directly at runtime, but there's (currently) no way to do that AFAICT (see https://stackoverflow.com/questions/43909566/get-keys-of-a-typescript-interface-as-array-of-strings)

//This particular workaround of using a duplicate readonly array came from https://stackoverflow.com/a/59420158/11866924
const navigationActionNames = [
  "tab",
  "shiftTab",
  "arrowUp",
  "arrowRight",
  "arrowDown",
  "arrowLeft",
] as const;

//This trick to make sure the 2 "lists of property names as string literal types" are always the same came from https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
type areDuplicateNavigationActionNamesTheSame = (<
  T
>() => T extends keyof INavigationActions ? 1 : 2) extends <
  T
>() => T extends typeof navigationActionNames[number] ? 1 : 2
  ? true
  : false;
const unused1: areDuplicateNavigationActionNamesTheSame = true; //Should cause a type error if they aren't

/* End hack */

interface IActivationActions {
  enter: (element: Element) => void;
}

/* Hack to export an iterable list of the interface's property names */

//None of the following would be necessary were it possible to iterate over the interface's property names directly at runtime, but there's (currently) no way to do that AFAICT (see https://stackoverflow.com/questions/43909566/get-keys-of-a-typescript-interface-as-array-of-strings)

//This particular workaround of using a duplicate readonly array came from https://stackoverflow.com/a/59420158/11866924
const activationActionNames = ["enter"] as const;

//This trick to make sure the 2 "lists of property names as string literal types" are always the same came from https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
type areDuplicateActivationActionNamesTheSame = (<
  T
>() => T extends keyof IActivationActions ? 1 : 2) extends <
  T
>() => T extends typeof activationActionNames[number] ? 1 : 2
  ? true
  : false;
const unused2: areDuplicateActivationActionNamesTheSame = true; //Should cause a type error if they aren't

/* End hack */

export {
  IKeyboardActions,
  INavigationActions,
  navigationActionNames,
  IActivationActions,
  activationActionNames,
};
