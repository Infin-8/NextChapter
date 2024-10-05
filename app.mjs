import useStore from './Store/state.mjs'
const { getState, setState, genID } = useStore
import { compose, getSum, mapAmounts, usdFormatter, titleCase, sanitize } from "./Utilities/helpers.mjs"

const updateBudget = e => {
    setState({ budget: parseFloat(sanitize(e.target.value)) });
}

// this needs to be a function declaration due to hoisting issues
function deleteExpense(e) {
    const { bills: _bills, expenses: _expenses, budget: _budget } = getState(),
        [expenseID] = e.target.attributes,
        { value } = expenseID,
        { amount } = _bills.find(({ _id }) => _id == value),
        bills = _bills.filter(({ _id }) => _id != value)

    let budget = parseFloat(_budget) + amount,
        expenses = Math.round(_expenses - amount)

    setState({
        budget,
        expenses,
        bills
    })

    document.getElementById("expenses").innerText = usdFormatter(expenses)
    document.getElementById("balance").innerText = usdFormatter(budget)

    appendBills(bills)
}

const appendBills = (expenses = []) => {

    const expensesNode = document.getElementById("display-expenses"),
        previousCards = document.querySelectorAll(".expense-card")

    previousCards.forEach(card => expensesNode.removeChild(card))
    expenses.forEach(({ name, amount, _id }) => {

        const cardContainer = document.createElement("div"),
            title = document.createElement("p"),
            amountNode = document.createElement("p"),
            deleteBTN = document.createElement("i");

        cardContainer.setAttribute("class", "expense-card");
        title.setAttribute('class', "dark-light-bg large-text")
        amountNode.setAttribute('class', "dark-light-bg large-text")
        title.innerText = titleCase(name);
        amountNode.innerText = usdFormatter(amount);
        deleteBTN.setAttribute("data-id", _id);
        deleteBTN.setAttribute("class", "fa-solid fa-trash-can dark-light-bg large-text")
        deleteBTN.setAttribute("onclick", "deleteExpense(event)")

        setTimeout(() => {
            [title, amountNode, deleteBTN]
                .forEach(node => { cardContainer.appendChild(node) })
            expensesNode.appendChild(cardContainer)
        }, 100);
    })
}

const addExpense = e => {
    e.preventDefault();

    const [budgetNode, billNode, amountNode] = document.querySelectorAll('input'),
        { budget, bills } = getState(),
        _id = genID();

    const expenses = [
        ...bills,
        {
            name: sanitize(billNode.value),
            amount: parseFloat(sanitize(amountNode.value)),
            _id
        }
    ];

    const newBudget = parseFloat(budget) - parseFloat(sanitize(amountNode.value));

    setState({
        budget: newBudget,
        expenses: compose(mapAmounts, getSum)(expenses),
        bills: expenses
    });

    const balanceNode = document.getElementById("balance"),
        expensesNode = document.getElementById("expenses");

    balanceNode.innerText = usdFormatter(newBudget);
    expensesNode.innerText = usdFormatter(compose(mapAmounts, getSum)(expenses));
    budgetNode.value = "";
    billNode.value = "";
    amountNode.value = "";
    appendBills(expenses);
}



window.addExpense = addExpense;
window.deleteExpense = deleteExpense
window.updateBudget = updateBudget;
window.appendBill = appendBills;