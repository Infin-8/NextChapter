# Utility Functions Documentation

This documentation provides details about the utility functions included in the module. These functions perform various operations such as composing functions, summing values, formatting currency, and sanitizing inputs.

## Table of Contents

- [Function Composition (`compose`)](#function-composition-compose)
- [Sum of Array Values (`getSum`)](#sum-of-array-values-getsum)
- [Extracting Amounts from Objects (`mapAmounts`)](#extracting-amounts-from-objects-mapamounts)
- [USD Formatter (`usdFormatter`)](#usd-formatter-usdformatter)
- [Title Case Conversion (`titleCase`)](#title-case-conversion-titlecase)
- [Sanitize Input (`sanitize`)](#sanitize-input-sanitize)
- [Sanitize Troll Inputs (`sanitizeTrolls`)](#sanitize-troll-inputs-sanitizetrolls)

First, ensure you import the functions from the `helpers` module:

```js
import {
  compose,
  getSum,
  mapAmounts,
  usdFormatter,
  titleCase,
  sanitize,
  sanitizeTrolls,
} from "./Utilities/helpers.mjs";
```

## Function Composition `compose()`

The `compose` function allows you to compose multiple functions into one. It takes an arbitrary number of functions (`fns`) as arguments and returns a function that takes an initial value (`initial`). The composed functions are applied from left to right, passing the result of one function as the input to the next.

### Usage

```js
export const compose =
  (...fns) =>
  (initial) =>
    fns.reduce((result, next) => next(result), initial);

const add1 = (x) => x + 1;
const double = (x) => x * 2;
const composedFn = compose(add1, double);
console.log(composedFn(2)); // Output: 6 (i.e., (2 + 1) * 2)
```

## Sum of Array Values `getSum()`

The getSum function takes an array of numbers and returns the sum of all the values.

### Usage

```js
export const getSum = (arr) => arr.reduce((a, b) => a + b, 0);

const numbers = [1, 2, 3];
console.log(getSum(numbers)); // Output: 6
```

## Extracting Amounts from Objects `mapAmounts()`

The mapAmounts function extracts the amount property from an array of objects and returns an array of amounts.

### Usage

```js
export const mapAmounts = (arr) => arr.map(({ amount }) => amount);

const bills = [{ amount: 50 }, { amount: 75 }, { amount: 100 }];
console.log(mapAmounts(bills)); // Output: [50, 75, 100]
```

## USD Formatter `usdFormatter()`

The usdFormatter function formats a number into a currency string using the USD format. If the input is not provided or falsy, it returns $0.

### Usage

```js
export const usdFormatter = (str) =>
  str
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumSignificantDigits: 6,
      }).format(str)
    : "$0";

console.log(usdFormatter(1234.56)); // Output: $1,234.56
```

## Title Case Conversion `titleCase()`

The titleCase function converts a string to title case, capitalizing the first letter of each word.

### Usage

```js
export const titleCase = (str) =>
  str.toLowerCase().replace(/^\w|\s\w/g, (l) => l.toUpperCase());

console.log(titleCase("hello world")); // Output: "Hello World"
```

## Sanitize Input `sanitize()`

The sanitize function sanitizes a string by replacing certain characters (e.g., &, <, >, ", ') with their corresponding HTML entities. It also removes any non-alphanumeric characters except for certain punctuation marks and trims leading/trailing whitespace.

### Usage

```js
export const sanitize = (input) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/[^a-zA-Z0-9 .,!?@#%&()-_]/g, "")
    .trim();

console.log(sanitize('Hello <script>alert("XSS")</script>!'));
// Output: "Hello &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;!"
```

## Sanitize Troll Inputs `sanitizeTrolls()`

The sanitizeTrolls function truncates the input string to the first 8 characters.

### Usage

```js
export const sanitizeTrolls = (input) => input.slice(0, 8);

console.log(sanitizeTrolls("ThisIsTooLong"));
// Output: "ThisIsTo"
```
