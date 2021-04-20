function getAllTerminalDivs(container: Element): Array<Element> {
  return Array.from(container.querySelectorAll("div")).filter(
    (el) => el.children.length === 0
  );
}

function addFocusabilityRemovalHandlers(el: Element): void {
  ["focusout", "blur"].forEach((eventType) => {
    el.addEventListener(eventType, () => {
      el.removeAttribute("tabindex");
    });
  });
}

function moveFocusToEl(el: Element): void {
  if (!el) {
    return;
  }

  //console.log("Moving focus to", el.textContent);

  el.setAttribute("tabindex", "0");
  (el as HTMLElement).focus();
}

function findElementFromTextContent(
  possibleEls: Array<Element>,
  textContent: string
): Element {
  return possibleEls.find((el) => el.textContent.includes(textContent));
}

type FocusMoveCalculator = (curEl: Element, action: string) => Element;

function addKeypressHandlers(
  el: Element,
  computeWhereToMoveFocus: FocusMoveCalculator
): void {
  el.addEventListener("keydown", (event) => {
    const action = getActionFromEvent(event);

    if (action && el.isSameNode(document.activeElement)) {
      reactToAction(el, action, computeWhereToMoveFocus);
    }

    event.preventDefault(); //For stopping the default tab/shift+tab behavior from changing focus afterwards
  });
}

function reactToAction(
  curEl: Element,
  action: string,
  computeWhereToMoveFocus: FocusMoveCalculator
) {
  const elToMoveFocusTo = computeWhereToMoveFocus(curEl, action);

  moveFocusToEl(elToMoveFocusTo);
}

function getActionFromEvent(keyboardEvent) {
  const { key, shiftKey: shiftKeyPressed } = keyboardEvent;

  if (key === "Tab") {
    return shiftKeyPressed ? "shiftTab" : "tab";
  }

  return arrowKeyToActionMap[key]; //may be undefined
}

const arrowKeyToActionMap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
  ArrowLeft: "left",
};

export {
  getAllTerminalDivs,
  addFocusabilityRemovalHandlers,
  findElementFromTextContent,
  addKeypressHandlers,
  moveFocusToEl,
};
