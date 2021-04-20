import { IKeyboardActions } from "./shared/interfaces";

function navigateTo(
  element: Element,
  keyboardActions: IKeyboardActions
): boolean {
  const foundElement = findTarget(
    element,
    document.activeElement,
    new KeyboardNavigationGraphAdapter(),
    keyboardActions
  );

  return foundElement;
}

function findTarget(
  targetEl: Element,
  startEl: Element,
  kngService: KeyboardNavigationGraphAdapter,
  keyboardActions: IKeyboardActions
): boolean {
  if (startEl.isSameNode(targetEl)) {
    return true;
  }

  const unexploredDirection = kngService.findAnyNotFullyExploredDirectionStartingFrom(
    startEl,
    keyboardActions
  );
  if (!unexploredDirection) {
    //Everything from this point on has already been explored w/o finding the target
    return false;
  }

  const keyboardActionToPerform = keyboardActions[unexploredDirection];
  keyboardActionToPerform(startEl);
  const newStartEl = document.activeElement;

  kngService.recordConnection(unexploredDirection, {
    from: startEl,
    to: newStartEl,
  });

  return findTarget(targetEl, newStartEl, kngService, keyboardActions);
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

  findAnyNotFullyExploredDirectionStartingFrom(
    rootElement: Element,
    keyboardActions: IKeyboardActions
  ): keyof IKeyboardActions | undefined {
    const pointersToPreviouslyVisitedChildren = this.__actionPointers.get(
      rootElement
    );

    if (!pointersToPreviouslyVisitedChildren) {
      //Nothing has been explored yet so just try something
      return "tab";
    }

    let actionName: keyof IKeyboardActions; //This and the extra parameter/object are here just b/c there's no good way (currently) to iterate over the properties of a TS interface
    for (actionName in keyboardActions) {
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
          keyboardActions
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
