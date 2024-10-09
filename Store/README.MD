# App State Documentation

This documentation outlines how to manage and modify the application's state using `useStore`, including retrieving the current state and updating it dynamically.

## Table of Contents

- [Import Statements](#import-statements)
- [App State Structure](#app-state-structure)
- [Retrieving the Current State (`getState`)](#retrieving-the-current-state-getstate)
- [Updating the State (`setState`)](#updating-the-state-setstate)

## Import Statements

First, ensure you import the state management functions from the `useStore` module and destructure the necessary functions to manage the state:

### Usage

```js
import useStore from "./Store/state.mjs";
const { getState, setState, genID } = useStore;
```

## App State Structure

The application’s main state is an object that contains the following key-value pairs:

```js

{
    budget: 0,         // The total budget set by the user
    expenses: 0,       // The total expenses recorded
    bills: [],         // An array of bill objects, each representing a specific bill
    inputs: {},        // Stores user inputs (e.g., form data)
    edits: {},         // Stores any data related to edits being made to a bill
    editId: "",        // Stores the ID of the item being edited
    modal: false       // Controls whether a modal (e.g., for adding/editing bills) is open
}

```

Breakdown of the State:

    •	budget: Stores the total budget value.
    •	expenses: A sum of all expenses entered by the user.
    •	bills: An array holding bill objects (each representing individual expenses or payments).
    •	inputs: An object used to store form data entered by the user.
    •	edits: An object that temporarily holds data for an ongoing edit operation.
    •	editId: A string representing the ID of the item currently being edited.
    •	modal: A boolean value indicating if the modal is open or closed (useful for UI management).

## Retrieving the Current State `getState()`

The getState function allows you to retrieve the current state object. It returns the entire application state, which you can read or use as needed.

### Usage

```js
const state = getState();
console.log(state.budget); // Outputs the current budget
```

## Updating the State `setState()`

The setState function enables you to update specific properties in the application’s state. It takes an object as an argument, where the keys represent the state properties to be updated, and the values represent the new values for those properties.

setState ensures that the state is updated immutably by creating a copy of the current state and applying the changes on top.

### Usage

```js
setState({
  budget: newBudget,
  expenses: compose(mapAmounts, getSum)(expenses), // Calculates the total expenses
  bills: expenses, // Updates the bills array
});
```
