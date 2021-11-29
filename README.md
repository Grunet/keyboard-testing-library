# Keyboard Testing Library

An extension of [Testing Library](https://testing-library.com/) that helps simulate keyboard-only users' behaviors

## The Problem

UI test suites are normally written from the perspective of mouse or touch users. This then misses out on the experiences of keyboard users, making them more susceptible to bugs and regressions.

## This Solution

This library composes a few primitive user interactions (e.g. simulated key presses) into higher-level actions (e.g. simulating navigation to an element via the keyboard, and then pressing the Enter key to activate it).

These actions can then be used to conditionally transform an ordinary click-based test suite into a keyboard-oriented one, with minimal changes.

## Installation

Install the library as a dev dependency. You may notice a few peer dependency warnings crop up when you do that.

```
npm install --save-dev keyboard-testing-library
```

If you don't need to provide your own custom handling for key press simulation to use instead of the default shims Testing Library provides, install the following as dev dependencies

```
npm install --save-dev @testing-library/user-event
npm install --save-dev @testing-library/dom
```

If you do need to customize them, pay attention to [this section](#using-your-own-keypress-simulators) below.

## Getting Started

The details will vary based on the tools you're using, but the core idea is captured in the following [Jest](https://jestjs.io/)-specific snippet, which you'll want to add someplace that will run before each of your test suites (in Jest's case, within a [setupFilesAfterEnv](https://jestjs.io/docs/configuration#setupfilesafterenv-array) script)

```
import userEvent from "@testing-library/user-event";
import keyboardOnlyUserEvent from "keyboard-testing-library";
...
if (process.env["USE_KEYBOARD"]) {
  jest
    .spyOn(userEvent, "click")
    .mockImplementation(keyboardOnlyUserEvent.navigateToAndPressEnter);
}
```

Then before executing the tests, set the environment variable to a truthy value, for example via a npm script using the [cross-env](https://www.npmjs.com/package//cross-env) helper library

```
"scripts": {
    ...
    "test": "jest",
    "test-with-keyboard": "cross-env USE_KEYBOARD=1 npm test"
    ...
  }

```

## Documentation

TODO - need to document what's on keyboardOnlyUserEvent, or MUCH BETTER yet do that in code and point to a d.ts file in Github where it's all covered

### Using Your Own Keypress Simulators

TODO - since you called it out way above, describe this seperately from the docs above (and why you might want to do it, e.g. if you have a better tab key press implementation coming from real browser behavior instead of a shim like the default)
