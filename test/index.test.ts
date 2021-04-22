//Test helpers
import { expect, test } from "@jest/globals";
import { getByText } from "@testing-library/dom";

//Test components
import { render as render3dCube } from "./components/3x3x3 Cube";
import { render as renderHystereticLine } from "./components/Hysteretic Line";

//Code under test
import { keyboardOnlyUserEvent } from "../dist/index";

test("Starting at one corner of the cube, it can navigate to the other corner", () => {
  //ARRANGE
  render3dCube(document.body); //Should start focus at the 1,1,1 corner
  const targetEl = getByText(document.body, "3,3,3");

  //ACT
  keyboardOnlyUserEvent.navigateTo(targetEl);

  //ASSERT
  expect(document.activeElement).toEqual(targetEl);
});

test("When given an unfocusable target, it throws an error", () => {
  //ARRANGE
  render3dCube(document.body); //Focus should stay trapped inside the cube

  const unfocusableTargetEl = document.createElement("div");
  document.body.appendChild(unfocusableTargetEl);

  //"ACT" (actual execution happens during the assert phase)
  function navigateToUnfocusableEl() {
    keyboardOnlyUserEvent.navigateTo(unfocusableTargetEl);
  }

  //ASSERT
  expect(navigateToUnfocusableEl).toThrow(
    `Unable to navigate to ${unfocusableTargetEl.outerHTML} using only the keyboard`
  );
});

test("Even when the focus management is hysteretic, it still finds the target", () => {
  //ARRANGE
  renderHystereticLine(document.body); //Should start focus at the "1" at the bottom
  const targetEl = getByText(document.body, "2");

  //ACT
  keyboardOnlyUserEvent.navigateTo(targetEl);

  //ASSERT
  expect(document.activeElement).toEqual(targetEl);
});
