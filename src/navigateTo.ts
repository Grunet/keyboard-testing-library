import { INavigationActions } from "./shared/interfaces";

function navigateTo(
  element: Element,
  navigationActions: INavigationActions
): boolean {
  const foundElement = findTarget(
    element,
    document.activeElement,
    new KeyboardNavigationGraphAdapter(),
    navigationActions
  );

  return foundElement;
}

function findTarget(
  targetEl: Element,
  startEl: Element,
  kngService: KeyboardNavigationGraphAdapter,
  navigationActions: INavigationActions
): boolean {
  let currentEl = startEl;

  /*eslint no-constant-condition: ["error", { "checkLoops": false }] -- to allow for the infinite while loop */
  while (true) {
    if (currentEl.isSameNode(targetEl)) {
      return true;
    }

    const unexploredDirection = kngService.findAnyNotFullyExploredDirectionStartingFrom(
      currentEl,
      navigationActions
    );
    if (!unexploredDirection) {
      //Everything from this point on has already been explored w/o finding the target
      return false;
    }

    const navActionToPerform = navigationActions[unexploredDirection];
    navActionToPerform(currentEl);
    const newCurrentEl = document.activeElement;

    kngService.recordConnection(unexploredDirection, {
      from: currentEl,
      to: newCurrentEl,
    });

    currentEl = newCurrentEl;
  }
}

class KeyboardNavigationGraphAdapter {
  private __actionPointers: Map<
    Element,
    Map<keyof INavigationActions, Element>
  > = new Map();

  recordConnection(
    method: keyof INavigationActions,
    endpoints: { from: Element; to: Element }
  ): void {
    const currentPointers =
      this.__actionPointers.get(endpoints.from) || new Map();
    currentPointers.set(method, endpoints.to);

    this.__actionPointers.set(endpoints.from, currentPointers); //In case a new Map was made
  }

  findAnyNotFullyExploredDirectionStartingFrom(
    rootElement: Element,
    navigationActions: INavigationActions
  ): keyof INavigationActions | undefined {
    const pointersToPreviouslyVisitedChildren = this.__actionPointers.get(
      rootElement
    );

    if (!pointersToPreviouslyVisitedChildren) {
      //Nothing has been explored yet so just try something
      return "tab";
    }

    let actionName: keyof INavigationActions; //This and the extra parameter/object are here just b/c there's no good way (currently) to iterate over the properties of a TS interface
    for (actionName in navigationActions) {
      if (!pointersToPreviouslyVisitedChildren.has(actionName)) {
        //This direction hasn't been tried before so give it a shot
        return actionName;
      }
    }

    for (const [
      actionName,
      childElement,
    ] of pointersToPreviouslyVisitedChildren) {
      if (
        this.findAnyNotFullyExploredDirectionStartingFrom(
          childElement,
          navigationActions
        )
      ) {
        //This direction has been explored before, but not fully
        return actionName;
      }
    }

    //All downstream pathways have been explored
    return undefined;
  }
}

export { navigateTo };
