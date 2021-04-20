import {
  getAllTerminalDivs,
  addFocusabilityRemovalHandlers,
  findElementFromTextContent,
  addKeypressHandlers,
  moveFocusToEl,
} from "./shared/buildingBlocks";

/**
 * Creates a 3d cube of elements,
 * where tabbing, up/down arrowing, and left/right arrowing
 * move focus 1 unit along each of the dimensions of the cube
 *
 * @param container an element to inject the component content into
 */
function render(container: HTMLElement): void {
  container.innerHTML = `
  <div>
  <div>
    <div>
      <div>
        1,1,1
      </div>
      <div>
        1,1,2
      </div>
      <div>
        1,1,3
      </div>
     </div>
     <div>
        <div>
          1,2,1
        </div>
        <div>
          1,2,2
        </div>
        <div>
          1,2,3
        </div>
     </div>
     <div>
        <div>
          1,3,1
        </div>
        <div>
          1,3,2
        </div>
        <div>
          1,3,3
        </div>
     </div>
  </div>
  <div>
    <div>
      <div>
        2,1,1
      </div>
      <div>
        2,1,2
      </div>
      <div>
        2,1,3
      </div>
     </div>
     <div>
        <div>
          2,2,1
        </div>
        <div>
          2,2,2
        </div>
        <div>
          2,2,3
        </div>
     </div>
     <div>
        <div>
          2,3,1
        </div>
        <div>
          2,3,2
        </div>
        <div>
          2,3,3
        </div>
     </div>
  </div>
  <div>
    <div>
      <div>
        3,1,1
      </div>
      <div>
        3,1,2
      </div>
      <div>
        3,1,3
      </div>
     </div>
     <div>
        <div>
          3,2,1
        </div>
        <div>
          3,2,2
        </div>
        <div>
          3,2,3
        </div>
     </div>
     <div>
        <div>
          3,3,1
        </div>
        <div>
          3,3,2
        </div>
        <div>
          3,3,3
        </div>
     </div>
  </div>
</div>
  `;

  setupInteractiveBehavior(container);
}

function setupInteractiveBehavior(container: HTMLElement) {
  const cubeEls = getAllTerminalDivs(container);

  cubeEls.forEach(addFocusabilityRemovalHandlers);

  cubeEls.forEach((el) => {
    addKeypressHandlers(el, (curEl, action) => {
      return computeWhereToMoveFocus(cubeEls, curEl, action);
    });
  });

  //Initialization
  const whereToSetInitialFocus = "1,1,1";
  const elToSetInitialFocus = findElementFromTextContent(
    cubeEls,
    whereToSetInitialFocus
  );

  moveFocusToEl(elToSetInitialFocus);
  //elToSetInitialFocus.setAttribute("tabindex", "0"); //For debugging in the browser
}

function computeWhereToMoveFocus(
  cubeEls: Array<Element>,
  curEl: Element,
  action: string
) {
  const curCoordinates = getCoordsOfEl(curEl);
  const coordChangeFn = actionToCoordChangeMap[action];

  const newCoordinates = { ...curCoordinates };
  coordChangeFn(newCoordinates); //Modification in-place

  const newTextContentToFind = getTextContentFromCoords(newCoordinates);

  const newEl = findElementFromTextContent(cubeEls, newTextContentToFind);

  return newEl.isSameNode(curEl) ? null : newEl;
}

const actionToCoordChangeMap = {
  tab: (coords) => {
    coords["tab"] = Math.min(coords["tab"] + 1, 3);
  },
  shiftTab: (coords) => {
    coords["tab"] = Math.max(coords["tab"] - 1, 1);
  },
  up: (coords) => {
    coords["vertical"] = Math.min(coords["vertical"] + 1, 3);
  },
  down: (coords) => {
    coords["vertical"] = Math.max(coords["vertical"] - 1, 1);
  },
  right: (coords) => {
    coords["horizontal"] = Math.min(coords["horizontal"] + 1, 3);
  },
  left: (coords) => {
    coords["horizontal"] = Math.max(coords["horizontal"] - 1, 1);
  },
};

function getCoordsOfEl(el) {
  const [tab, vertical, horizontal] = el.textContent.split(",");

  return {
    tab: Number(tab),
    vertical: Number(vertical),
    horizontal: Number(horizontal),
  };
}

function getTextContentFromCoords(coordinates) {
  const { tab, vertical, horizontal } = coordinates;

  return `${tab},${vertical},${horizontal}`;
}

export { render };
