# State Management Documentation

## Table of Contents

- [1. types.mjs](#1-typesmjs)
- [2. actions.mjs](#2-actionsmjs)
- [3. reducer.mjs](#3-reducermjs)
- [4. initialState.mjs](#4-initialstatemjs)
- [5. store.mjs](#5-storemjs)
- [General Workflow Explanation](#general-workflow-explanation)
- [Example of Full Workflow](#example-of-full-workflow)

---

## 1. `types.mjs`

This module defines constants representing action types. These constants are used in action creators and the reducer to ensure consistency and avoid hardcoded strings.

### Code:

```javascript
const types = {
  SET_BUDGET: "SET_BUDGET",
  SET_EXPENSES: "SET_EXPENSES",
  SET_BILLS: "SET_BILLS",
};

export default types;
```

### Purpose

    •	Centralize action types: Define the action types that will be used in actions and reducers to manage different parts of the state.
    •	Avoid typos: Using constants prevents typos that could occur when typing action names multiple times across the codebase.

### Usage

```js
import types from "../Constants/types.mjs";

const { SET_BUDGET } = types;

console.log(SET_BUDGET); // Outputs: 'SET_BUDGET'
```

## 2. `actions.mjs`

This module defines action creator functions, which return action objects to be dispatched. These actions carry the payload needed for updating state.

### Code:

```js
import types from "../Constants/types.mjs";

const { SET_BUDGET, SET_EXPENSES, SET_BILLS } = types;

const actions = {
  setBudget: payload => ({ type: SET_BUDGET, payload }),
  setExpenses: payload => ({ type: SET_EXPENSES, payload }),
  setBills: payload => ({ type: SET_BILLS, payload }),
};

export default actions;
```

### Purpose

    •	Action creators: Functions that return action objects with a specific type and an optional payload. These actions can then be dispatched to update the state.

### Usage

```js
import actions from "./Actions/actions.mjs";

const budgetAction = actions.setBudget(1000);

console.log(budgetAction);
// Outputs: { type: 'SET_BUDGET', payload: 1000 }
```

## 3. `reducer.mjs`

The reducer function is responsible for handling actions and updating the state based on the action type and payload. It takes the current state and an action as arguments and returns the new state.

### Code:

```js
import types from "../Constants/types.mjs";

const { SET_BUDGET, SET_EXPENSES, SET_BILLS } = types;

const reducer = (state, action) => {
  switch (action.type) {
    case SET_BUDGET:
      return { ...state, budget: action.payload };
    case SET_EXPENSES:
      return { ...state, expenses: action.payload };
    case SET_BILLS:
      return { ...state, bills: action.payload };
    default:
      return state;
  }
};

export default reducer;
```

### Purpose

    •	Manage state changes: The reducer function listens for dispatched actions and updates the state based on the type of the action and the payload it carries.
    •	Immutable state updates: The reducer returns a new state object without mutating the current state.

### Usage

```js
import reducer from "./Reducers/reducer.mjs";

const initialState = { budget: 0, expenses: 0, bills: [] };
const action = { type: "SET_BUDGET", payload: 500 };

const newState = reducer(initialState, action);

console.log(newState);
// Outputs: { budget: 500, expenses: 0, bills: [] }
```

## 4. `initialState.mjs`

This module provides the initial state for the application. It defines the default values for the state properties before any actions are dispatched.

### Code:

```js
const initialState = {
  budget: 0,
  expenses: 0,
  bills: [],
  inputs: {},
  edits: {},
  editId: "",
  modal: false,
};

export default initialState;
```

### Purpose

    •	Define the default state: This object contains the initial values for each part of the application’s state, which will be passed to the reducer before any actions occur.

### Usage

```js
import initialState from "./State/initialState.mjs";

console.log(initialState);
// Outputs: { budget: 0, expenses: 0, bills: [], inputs: {}, edits: {}, editId: "", modal: false }
```

## 5. `store.mjs`

This module creates a custom store that holds the application state, and provides getState and dispatch functions. Instead of using React’s useState, you’re managing state with a custom implementation using a reducer.

### Code:

```js
import reducer from "./Reducers/reducer.mjs";
import initial_State from "./State/initialState.mjs";

export default (function () {
  let _state = initial_State;

  const getState = () => JSON.parse(JSON.stringify(_state)); // Get a deep clone of the state

  const dispatch = (action) => {
    _state = reducer(_state, action); // Update the state using the reducer
  };

  return { getState, dispatch };
})();
```

### Purpose

    •	Custom store: This function returns an object with getState and dispatch methods to manage the application state.
    •	getState: Returns the current state.
    •	dispatch: Accepts an action and updates the state using the reducer.
    •	Internal state management: Keeps the state private and exposes only necessary methods for accessing and updating it.

### Usage

```js
import store from "./Store/store.mjs";
import actions from "./Actions/actions.mjs";

console.log(store.getState());
// Outputs: initial state

store.dispatch(actions.setBudget(2000));

console.log(store.getState());
// Outputs: updated state with budget set to 2000
```

# General Workflow Explanation:

    1.	Initial State:
    •	The state starts as initialState, which is defined in initialState.mjs.
    2.	Actions:
    •	When you want to update the state, you create an action using one of the action creators in actions.mjs.
    3.	Dispatch:
    •	The action is passed to the dispatch function in store.mjs. dispatch calls the reducer to determine how the state should change based on the action.
    4.	Reducer:
    •	The reducer.mjs function takes the current state and the action, processes it, and returns a new state.
    5.	State Update:
    •	The dispatch function in the store updates the private _state variable with the new state returned by the reducer. You can retrieve the updated state by calling getState.

# Example Of Full Workflow

```js
import store from "./Store/store.mjs";
import actions from "./Actions/actions.mjs";

// Check initial state
console.log(store.getState());
// Outputs: { budget: 0, expenses: 0, bills: [], inputs: {}, edits: {}, editId: "", modal: false }

// Dispatch an action to set the budget
store.dispatch(actions.setBudget(3000));

// Check updated state
console.log(store.getState());
// Outputs: { budget: 3000, expenses: 0, bills: [], inputs: {}, edits: {}, editId: "", modal: false }

// Dispatch another action to add an expense
store.dispatch(actions.setExpenses(500));

// Check updated state
console.log(store.getState());
// Outputs: { budget: 3000, expenses: 500, bills: [], inputs: {}, edits: {}, editId: "", modal: false }
```
