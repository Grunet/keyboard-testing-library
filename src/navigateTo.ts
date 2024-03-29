import {
  INavigationActions,
  navigationActionNames,
  ILogger,
} from "./shared/interfaces";

async function navigateTo(
  element: Element,
  navigationActions: INavigationActions,
  logger: ILogger
): Promise<boolean> {
  const foundElement = await findTarget(
    element,
    new KeyboardNavigationGraphAdapter(),
    navigationActions,
    logger
  );

  return foundElement;
}

async function findTarget(
  targetEl: Element,
  kngService: KeyboardNavigationGraphAdapter,
  navigationActions: INavigationActions,
  logger: ILogger
): Promise<boolean> {
  let curEl = getCurrentlyFocusedEl();
  /*eslint no-constant-condition: ["error", { "checkLoops": false }] -- to allow for the infinite while loop */
  while (true) {
    if (targetEl.isSameNode(curEl)) {
      return true;
    }

    const unexploredPath = kngService.findUnexploredPath(curEl);
    if (!unexploredPath) {
      //Everything from this point on has already been explored w/o finding the target
      return false;
    }
    logger?.capturePath(unexploredPath);

    const newCurEl = await followPath(
      curEl,
      unexploredPath,
      kngService,
      navigationActions
    );

    curEl = newCurEl;
    logger?.captureCurrentElement(curEl);
  }
}

async function followPath(
  startEl: Element,
  pathOfActions: Array<keyof INavigationActions>,
  kngService: KeyboardNavigationGraphAdapter,
  navigationActions: INavigationActions
): Promise<Element> {
  const elsOnPath: Array<Element> = [startEl];
  const remainingPath = [...pathOfActions];

  while (remainingPath.length > 0) {
    const nextAction = remainingPath.shift();

    const navActionToPerform = navigationActions[nextAction];

    await navActionToPerform(elsOnPath[0]);
    const nextEl = getCurrentlyFocusedEl();

    elsOnPath.unshift(nextEl);
  }

  const lastAction = pathOfActions[pathOfActions.length - 1];
  const [lastEl, secondToLastEl] = elsOnPath;

  if (lastAction && secondToLastEl && lastEl) {
    //All but the last action should've been previously recorded
    kngService.recordConnection(lastAction, {
      from: secondToLastEl,
      to: lastEl,
    });
  }

  return lastEl;
}

function getCurrentlyFocusedEl() {
  return document.activeElement;
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

  findUnexploredPath(
    rootEl: Element
  ): Array<keyof INavigationActions> | undefined {
    return this.__findUnexploredPath(rootEl, new Set());
  }

  private __findUnexploredPath(
    rootEl: Element,
    alreadyExploredFromEls: Set<Element>
  ): Array<keyof INavigationActions> | undefined {
    alreadyExploredFromEls.add(rootEl);

    const pointersToAdjacentEls = this.__actionPointers.get(rootEl);

    if (!pointersToAdjacentEls) {
      //Nothing has been explored yet so just try something
      return ["tab"];
    }

    for (const actionName of navigationActionNames) {
      if (!pointersToAdjacentEls.has(actionName)) {
        //This direction hasn't been tried before so give it a shot
        return [actionName];
      }
    }

    for (const [actionName, adjacentEl] of pointersToAdjacentEls) {
      if (alreadyExploredFromEls.has(adjacentEl)) {
        //This element was already checked earlier, so skip it now (to avoid the infinite recursion)
        continue;
      }

      const unexploredPathFromAdjacentEl = this.__findUnexploredPath(
        adjacentEl,
        alreadyExploredFromEls
      );

      if (unexploredPathFromAdjacentEl) {
        //This direction has been explored before, but not fully
        return [actionName, ...unexploredPathFromAdjacentEl];
      }
    }

    //All downstream pathways have been explored
    return undefined;
  }
}

export { navigateTo };
