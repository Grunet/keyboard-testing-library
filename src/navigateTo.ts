import { IKeyboardActions } from "./shared/interfaces";

function navigateTo(
  element: Element,
  keyboardActions: IKeyboardActions
): boolean {
  const {
    tab,
    shiftTab,
    arrowUp,
    arrowRight,
    arrowDown,
    arrowLeft,
  } = keyboardActions;

  const oneDirExplorerFuncs = {
    tab: createExplorer("tab", tab, shiftTab),
    shiftTab: createExplorer("shiftTab", shiftTab, tab),
    arrowUp: createExplorer("arrowUp", arrowUp, arrowDown),
    arrowRight: createExplorer("arrowRight", arrowRight, arrowLeft),
    arrowDown: createExplorer("arrowDown", arrowDown, arrowUp),
    arrowLeft: createExplorer("arrowLeft", arrowLeft, arrowRight),
  };

  const foundElement = exploreInAllDirections(
    { startingEl: document.activeElement, targetEl: element },
    new KeyboardNavigationGraphAdapter(),
    oneDirExplorerFuncs
  );

  return foundElement;
}

function exploreInAllDirections(
  boundaryConditions: IBoundaryConditions,
  kngService: KeyboardNavigationGraphAdapter,
  oneDirExplorerFuncs: { [index in keyof IKeyboardActions]: IExplore }
): boolean {
  const exploreInAllDirectionsDelegate = (
    newBoundaryConditions: IBoundaryConditions
  ) => {
    return exploreInAllDirections(
      newBoundaryConditions,
      kngService,
      oneDirExplorerFuncs
    );
  };

  for (const [direction, explorerFunc] of Object.entries(oneDirExplorerFuncs)) {
    const targetElFound = explorerFunc(
      boundaryConditions,
      kngService,
      exploreInAllDirectionsDelegate
    );
    if (targetElFound) {
      return true;
    }
  }

  return false;
}

function createExplorer(
  keyboardActionName: keyof IKeyboardActions,
  applyKeyboardAction: (element: Element) => void,
  performReverseAction: (element: Element) => void
): IExplore {
  return function (
    boundaryConditions: IBoundaryConditions,
    kngService: KeyboardNavigationGraphAdapter,
    exploreInAllDirectionsDelegate: (
      boundaryConditions: IBoundaryConditions
    ) => boolean
  ): boolean {
    const { startingEl, targetEl } = boundaryConditions;

    applyKeyboardAction(startingEl);
    const currentEl = document.activeElement;

    if (currentEl.isSameNode(targetEl)) {
      return true;
    }

    kngService.recordConnection(keyboardActionName, {
      from: startingEl,
      to: currentEl,
    });

    if (!kngService.checkIfAlreadyVisited(currentEl)) {
      const targetElFound = exploreInAllDirectionsDelegate({
        startingEl: currentEl,
        targetEl: targetEl,
      });
      if (targetElFound) {
        return true;
      }
    }

    performReverseAction(currentEl); //Idea is to bring focus back to startingEl before the next action

    return false;
  };
}

class KeyboardNavigationGraphAdapter {
  private __actionPointers: Map<
    Element,
    Map<keyof IKeyboardActions, Element>
  > = new Map();

  recordConnection(
    method: keyof IKeyboardActions,
    endpoints: { from: Element; to: Element }
  ): void {
    const currentPointers =
      this.__actionPointers.get(endpoints.from) || new Map();
    currentPointers.set(method, endpoints.to);

    this.__actionPointers.set(endpoints.from, currentPointers); //In case a new Map was made
  }

  checkIfAlreadyVisited(element: Element): boolean {
    return this.__actionPointers.has(element);
  }
}

type IExplore = (
  boundaryConditions: IBoundaryConditions,
  kngService: KeyboardNavigationGraphAdapter,
  exploreInAllDirectionsDelegate: (boundaryConditions: {
    startingEl: Element;
    targetEl: Element;
  }) => boolean
) => boolean;

interface IBoundaryConditions {
  startingEl: Element;
  targetEl: Element;
}

export { navigateTo };
