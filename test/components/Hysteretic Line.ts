export { render };

/**
 * Creates a 1d line of elements,
 * where up arrowing moves 2 units up, and down arrowing 1 unit down
 * @param container an element to inject the component content into
 */
function render(container: HTMLElement): void {
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

function setupInteractiveBehavior(container: HTMLElement) {
  const cubeEls = Array.from(container.querySelectorAll("div")).filter(
    (el) => el.children.length === 0
  );

  //console.log(cubeEls.length);

  //Make unfocusable after losing focus
  cubeEls.forEach((el) => {
    ["focusout", "blur"].forEach((eventType) => {
      el.addEventListener(eventType, () => {
        el.removeAttribute("tabindex");
      });
    });
  });

  //Handle tab, arrow key presses between els
  function moveFocusToEl(el) {
    if (!el) {
      return;
    }

    console.log("Moving focus to", el.textContent);

    el.setAttribute("tabindex", "0");
    el.focus();
  }

  //   function getCoordsOfEl(el) {
  //     const [tab, vertical, horizontal] = el.textContent.split(",");

  //     return {
  //       tab: Number(tab),
  //       vertical: Number(vertical),
  //       horizontal: Number(horizontal),
  //     };
  //   }

  //   function getTextContentFromCoords(coordinates) {
  //     const { tab, vertical, horizontal } = coordinates;

  //     return `${tab},${vertical},${horizontal}`;
  //   }

  function findElFromTextContent(possibleEls, textContent) {
    return possibleEls.find((el) => el.textContent.includes(textContent));
  }

  function computeWhereToMoveFocus(cubeEls, curEl, action) {
    switch (action) {
      case "up":
        return curEl.previousElementSibling?.previousElementSibling;
      case "down":
        return curEl.nextElementSibling;
      default:
        return undefined;
    }
  }

  //   const actionToCoordChangeMap = {
  //     tab: (coords) => {
  //       coords["tab"] = Math.min(coords["tab"] + 1, 3);
  //     },
  //     shiftTab: (coords) => {
  //       coords["tab"] = Math.max(coords["tab"] - 1, 1);
  //     },
  //     up: (coords) => {
  //       coords["vertical"] = Math.min(coords["vertical"] + 1, 3);
  //     },
  //     down: (coords) => {
  //       coords["vertical"] = Math.max(coords["vertical"] - 1, 1);
  //     },
  //     right: (coords) => {
  //       coords["horizontal"] = Math.min(coords["horizontal"] + 1, 3);
  //     },
  //     left: (coords) => {
  //       coords["horizontal"] = Math.max(coords["horizontal"] - 1, 1);
  //     },
  //   };

  function reactToAction(cubeEls, curEl, action) {
    const elToMoveFocusTo = computeWhereToMoveFocus(cubeEls, curEl, action);

    moveFocusToEl(elToMoveFocusTo);
  }

  //Setup event handlers to detect tab and arrow key presses, and then move focus around accordingly
  cubeEls.forEach((el) => {
    el.addEventListener("keydown", (event) => {
      const action = getActionFromEvent(event);

      if (action && el.isSameNode(document.activeElement)) {
        reactToAction(cubeEls, el, action);
      }

      event.preventDefault(); //For stopping the default tab/shift+tab behavior from changing focus afterwards
    });
  });

  function getActionFromEvent(keyboardEvent) {
    const { key, shiftKey: shiftKeyPressed } = keyboardEvent;

    //console.log(key);

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

  //Initialization

  const whereToSetInitialFocus = "1";

  const elToSetInitialFocus = findElFromTextContent(
    cubeEls,
    whereToSetInitialFocus
  );

  //console.log(elToSetInitialFocus);

  moveFocusToEl(elToSetInitialFocus);
  //elToSetInitialFocus.setAttribute("tabindex", "0"); //For debugging in the browser
}
