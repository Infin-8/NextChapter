# Budget App Documentation

This documentation provides an overview of the main functions of the Budget App, including how to add, delete, and display expenses.

## Table of Contents

- [Delete Expense](#delete-expense)
- [Append Bills](#append-bills)
- [Add Expense](#add-expense)

## Delete Expense

The `deleteExpense` function is responsible for removing an expense from the list of bills, updating the state, and reflecting the changes in the UI.

### Usage

```js
const deleteExpense = (e) => {
  // prevent the default action
  e.preventDefault();

  // Destructure bills, expenses, and budget from state and rename _key
  const { bills: _bills, expenses: _expenses, budget: _budget } = getState(),
    // destructure data-id attribute
    [expenseID] = e.target.attributes,
    // destruture the value
    { value } = expenseID,
    // find the bill with matching _id
    { amount } = _bills.find(({ _id }) => _id == value),
    // remove the bill from the list
    bills = _bills.filter(({ _id }) => _id != value);

  // assign new values for budget and expense
  let budget = parseFloat(_budget) + amount,
    expenses = Math.round(_expenses - amount);

  // setState with new values
  setState({ budget, expenses, bills });

  // make UI updates
  const balanceNode = document.getElementById("balance");
  balanceNode.innerText = usdFormatter(budget);
  balanceNode.style.color = budget > 0 ? "limegreen" : "red";
  document.getElementById("expenses").innerText = usdFormatter(expenses);

  // persist the data via local storage
  localStorage.setItem("bills", JSON.stringify(bills));
  localStorage.setItem("budget", budget);

  // append the new bills to the UI
  appendBills(bills);
};
```

## Append Bills

The `appendBills` function is responsible for updating the UI to display the list of expenses. It dynamically generates the expense cards and appends them to the DOM.

### Usage

```js
const appendBills = (expenses = []) => {
  // get the main node and any previous expense cards
  const expensesNode = document.getElementById("display-expenses"),
    previousCards = document.querySelectorAll(".expense-card");

  // remove all the previous cards
  previousCards.forEach((card) => expensesNode.removeChild(card));

  // for each expense create the card and assign the proper attributes for styling
  expenses.forEach(({ name, amount, _id }) => {
    const cardContainer = document.createElement("div"),
      title = document.createElement("p"),
      amountNode = document.createElement("p"),
      deleteBTN = document.createElement("i");

    cardContainer.setAttribute("class", "expense-card");
    title.setAttribute("class", "dark-light-bg large-text black-text");
    amountNode.setAttribute("class", "dark-light-bg large-text black-text");
    title.innerText = titleCase(name);
    amountNode.innerText = usdFormatter(amount);
    deleteBTN.setAttribute("data-id", _id);
    deleteBTN.setAttribute(
      "class",
      "fa-solid fa-trash-can dark-light-bg large-text"
    );
    deleteBTN.setAttribute("onclick", "deleteExpense(event)");

    // after a short delay append the new bills
    setTimeout(() => {
      [title, amountNode, deleteBTN].forEach((node) => {
        cardContainer.appendChild(node);
      });
      expensesNode.appendChild(cardContainer);
    }, 100);
  });
};
```

## Add Expense

The `addExpense` function handles adding new expenses to the list. It updates the app’s state and modifies the UI accordingly.

### Usage

```js
const addExpense = (e) => {
  // prevent the default action
  e.preventDefault();

  // destructure input nodes via querySelectorAll
  const [budgetNode, billNode, amountNode] = document.querySelectorAll("input"),
    // destructure budget and bills from state
    { budget, bills } = getState(),
    // generate a random ID
    _id = genID();

  // create the new bill list, appending the new bill to the list and assigning it the random ID
  const expenses = [
    ...bills,
    {
      name: sanitize(billNode.value),
      amount: parseFloat(compose(sanitizeTrolls, sanitize)(amountNode.value)),
      _id,
    },
  ];

  // calculate the new budget
  const newBudget =
    parseFloat(budget) -
    parseFloat(compose(sanitizeTrolls, sanitize)(amountNode.value));

  // persist the data via local storage
  localStorage.setItem("budget", newBudget);
  localStorage.setItem("bills", JSON.stringify(expenses));

  // make state updates
  setState({
    budget: newBudget,
    expenses: compose(mapAmounts, getSum)(expenses),
    bills: expenses,
  });

  // make UI updates
  const balanceNode = document.getElementById("balance"),
    expensesNode = document.getElementById("expenses");

  balanceNode.innerText = usdFormatter(newBudget);
  balanceNode.style.color = newBudget > 0 ? "limegreen" : "red";
  expensesNode.innerText = usdFormatter(compose(mapAmounts, getSum)(expenses));
  budgetNode.value = "";
  billNode.value = "";
  amountNode.value = "";

  // append the new bills
  appendBills(expenses);
};
```
