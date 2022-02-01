# Keyboard Testing Library

An extension of [Testing Library](https://testing-library.com/) that helps simulate keyboard-only users' behaviors

## The Problem

UI test suites are normally written from the perspective of mouse or touch users. This then misses out on the experiences of keyboard users, making their experiences more susceptible to bugs and regressions.

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
import keyboardOnlyUserEvent from "keyboard-testing-library/dist/require"; //The "dist/require" is due to Jest's lack of understanding of package export maps as of this writing (see https://github.com/facebook/jest/issues/9771 for up-to-date info on this topic)
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

You can find more info on the public methods of the library in the index.d.ts file installed alongside the library's source.

### Using Your Own Keypress Simulators

By default, the library will use either JS event dispatching or more complicated JS-based shims (taken from the 2 Testing Library peer dependencies mentioned above) to simulate keyboard actions a user can take.

However, if in your environment you have a way to more realistically simulate keyboard actions (e.g. via the Chrome DevTools Protocol) you can inject those via the `injectCustomShims` method on the default `keyboardOnlyUserEvent` export (before any of your tests start).

## Caveats

- If you're using the ESM distribution, you'll need to be on Node 14.8 or higher (or more generally a runtime that supports [top-level await](https://github.com/tc39/proposal-top-level-await)) as the library will use that language feature as part of its initial setup
