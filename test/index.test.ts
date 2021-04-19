//Test helpers
import { expect, test } from "@jest/globals";
import { getByText } from "@testing-library/dom";

//Test components
import { render as render3dCube } from "./components/3x3x3 Cube";

//Code under test
import { keyboardOnlyUserEvent } from "../dist/index";

test("Starting at one corner, it can navigate to the other corner of the cube", () => {
  //ARRANGE
  render3dCube(document.body); //Should start focus at the 1,1,1 corner
  const targetEl = getByText(document.body, "3,3,3");

  //ACT
  keyboardOnlyUserEvent.navigateTo(targetEl);

  //ASSERT
  expect(document.activeElement).toEqual(targetEl);
});
