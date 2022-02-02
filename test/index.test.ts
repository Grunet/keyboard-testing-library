//Test helpers
import { expect, test, jest, beforeEach } from "@jest/globals";
import { getByText } from "@testing-library/dom";

//Test components
import { render as render3dCube } from "./components/3x3x3 Cube";
import { render as renderHystereticLine } from "./components/Hysteretic Line";

//Code under test
import keyboardOnlyUserEvent from "../dist/require/index";
//keyboardOnlyUserEvent.setLogVerbosity("Verbose"); //Uncomment to run all tests with logging on

const rootContainer = document.body;

const globalSpies = {
  console: {
    log: jest.spyOn(console, "log"),
  },
};

beforeEach(() => {
  rootContainer.innerHTML = ""; //Incomplete workaround for Jest not allowing a way to reset JSDOM between tests in the same file (see https://github.com/facebook/jest/issues/1224)

  jest.clearAllMocks(); //Avoids spies remembering usage data between tests
});

test("Starting at one corner of the cube, it can navigate to the other corner", async () => {
  //ARRANGE
  render3dCube(rootContainer); //Should start focus at the 1,1,1 corner
  const targetEl = getByText(rootContainer, "3,3,3");

  //ACT
  await keyboardOnlyUserEvent.navigateTo(targetEl);

  //ASSERT
  expect(document.activeElement).toEqual(targetEl);
});

test("When given an unfocusable target, it throws an error", async () => {
  //ARRANGE
  render3dCube(rootContainer); //Focus should stay trapped inside the cube

  const unfocusableTargetEl = document.createElement("div");
  rootContainer.appendChild(unfocusableTargetEl);

  //"ACT" (actual execution happens during the assert phase)
  async function navigateToUnfocusableEl() {
    await keyboardOnlyUserEvent.navigateTo(unfocusableTargetEl);
  }

  //ASSERT
  await expect(navigateToUnfocusableEl).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to navigate to 

     [36m<div />[39m 

     using only the keyboard"
  `);
});

test("Even when the focus management is hysteretic, it still finds the target", async () => {
  //ARRANGE
  renderHystereticLine(rootContainer); //Should start focus at the "1" at the bottom
  const targetEl = getByText(rootContainer, "2");

  //ACT
  await keyboardOnlyUserEvent.navigateTo(targetEl);

  //ASSERT
  expect(document.activeElement).toEqual(targetEl);
});

test("When given a keyboard navigable target, it can activate the target's Enter key press handling", async () => {
  //ARRANGE
  const enterButton = document.createElement("button");
  enterButton.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    console.log("Enter pressed");
  });

  rootContainer.appendChild(enterButton);

  //ACT
  await keyboardOnlyUserEvent.navigateToAndPressEnter(enterButton);

  //ASSERT
  expect(globalSpies.console.log).toHaveBeenCalledWith("Enter pressed");
});

test("When given a keyboard navigable target, it can activate the target's Spacebar press handling", async () => {
  //ARRANGE
  const spacebarButton = document.createElement("button");
  spacebarButton.addEventListener("keydown", (event) => {
    if (event.key !== " ") {
      return;
    }

    console.log("Spacebar pressed");
  });

  rootContainer.appendChild(spacebarButton);

  //ACT
  await keyboardOnlyUserEvent.navigateToAndPressSpacebar(spacebarButton);

  //ASSERT
  expect(globalSpies.console.log).toHaveBeenCalledWith("Spacebar pressed");
});
