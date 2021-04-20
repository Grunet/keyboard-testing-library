import {
  getAllTerminalDivs,
  addFocusabilityRemovalHandlers,
  findElementFromTextContent,
  addKeypressHandlers,
  moveFocusToEl,
} from "./shared/buildingBlocks";

/**
 * Creates a 1d line of elements,
 * where up arrowing moves 2 units up, and down arrowing 1 unit down
 * @param container an element to inject the component content into
 */
function render(container: Element): void {
  container.innerHTML = `
    <div>
        <div>5</div>
        <div>4</div>
        <div>3</div>
        <div>2</div>
        <div>1</div>
    </div>
  `;

  setupInteractiveBehavior(container);
}

function setupInteractiveBehavior(container: Element) {
  const lineEls = getAllTerminalDivs(container);

  lineEls.forEach(addFocusabilityRemovalHandlers);

  lineEls.forEach((el) => {
    addKeypressHandlers(el, computeWhereToMoveFocus);
  });

  //Initialization
  const whereToSetInitialFocus = "1";
  const elToSetInitialFocus = findElementFromTextContent(
    lineEls,
    whereToSetInitialFocus
  );

  moveFocusToEl(elToSetInitialFocus);
  //elToSetInitialFocus.setAttribute("tabindex", "0"); //For debugging in the browser
}

function computeWhereToMoveFocus(curEl: Element, action: string): Element {
  switch (action) {
    case "up":
      return curEl.previousElementSibling?.previousElementSibling;
    case "down":
      return curEl.nextElementSibling;
    default:
      return undefined;
  }
}

export { render };
