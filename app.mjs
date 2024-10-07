import useStore from './Store/state.mjs'
const { getState, setState, genID } = useStore
import { compose, getSum, mapAmounts, usdFormatter, titleCase, sanitize } from "./Utilities/helpers.mjs"

function deleteExpense(e) {
    e.preventDefault()
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

    const balanceNode = document.getElementById("balance")
    balanceNode.innerText = usdFormatter(budget)
    balanceNode.style.color = budget > 0 ? "limegreen" : "red"
    document.getElementById("expenses").innerText = usdFormatter(expenses)
    localStorage.setItem('bills', JSON.stringify(bills))
    localStorage.setItem("budget", budget)
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
    localStorage.setItem('budget', newBudget.toString())
    localStorage.setItem('bills', JSON.stringify(expenses))
    setState({
        budget: newBudget,
        expenses: compose(mapAmounts, getSum)(expenses),
        bills: expenses
    });

    const balanceNode = document.getElementById("balance"),
        expensesNode = document.getElementById("expenses");

    balanceNode.innerText = usdFormatter(newBudget);
    balanceNode.style.color = newBudget > 0 ? "limegreen" : "red"
    expensesNode.innerText = usdFormatter(compose(mapAmounts, getSum)(expenses));
    expensesNode.style.color = "white"
    budgetNode.value = "";
    billNode.value = "";
    amountNode.value = "";
    appendBills(expenses);
}

document.getElementById('budget').addEventListener('blur', (e) => {

    const { bills } = getState(),
        balanceNode = document.getElementById('balance'),
        budget = parseFloat(sanitize(e.target.value)) - parseFloat(compose(mapAmounts, getSum)(bills))

    setState({ budget });
    balanceNode.innerText = usdFormatter(budget);
    balanceNode.style.color = budget > 0 ? "limegreen" : "red"
    localStorage.setItem("budget", sanitize(e.target.value));

})

window.onload = function () {
    const budget = localStorage.getItem('budget'),
        bills = localStorage.getItem('bills')

    if (budget) {
        const balanceNode = document.getElementById("balance")
        balanceNode.innerText = usdFormatter(budget)
        balanceNode.style.color = budget > 0 ? "limegreen" : "red"
        setState({ budget })
    }

    if (bills) {
        const expensesNode = document.getElementById("expenses");
        expensesNode.innerText = usdFormatter(String(compose(mapAmounts, getSum)(Array.from(JSON.parse(bills)))));
        expensesNode.style.color = "white"
        setState({
            bills: JSON.parse(bills),
            expenses: compose(mapAmounts, getSum)(Array.from(JSON.parse(bills)))
        })
        appendBills(JSON.parse(bills))
    }
};
window.addExpense = addExpense;
window.deleteExpense = deleteExpense
window.appendBill = appendBills;