import useStore from './Store/state.mjs';
const { getState, setState, genID } = useStore;
import { compose, getSum, mapAmounts, usdFormatter, titleCase, sanitize, sanitizeTrolls } from "./Utilities/helpers.mjs";

const deleteExpense = e => {
    e.preventDefault()
    const { bills: _bills, expenses: _expenses, budget: _budget } = getState(),
        [expenseID] = e.target.attributes,
        { value } = expenseID,
        { amount } = _bills.find(({ _id }) => _id == value),
        bills = _bills.filter(({ _id }) => _id != value);

    let budget = parseFloat(_budget) + amount,
        expenses = Math.round(_expenses - amount);

    setState({
        budget,
        expenses,
        bills
    });

    const balanceNode = document.getElementById("balance");
    balanceNode.innerText = usdFormatter(budget);
    balanceNode.style.color = budget > 0 ? "limegreen" : "red";
    document.getElementById("expenses").innerText = usdFormatter(expenses);
    localStorage.setItem('bills', JSON.stringify(bills));
    localStorage.setItem("budget", budget);
    appendBills(bills);
};

const appendBills = (expenses = []) => {

    const expensesNode = document.getElementById("display-expenses"),
        previousCards = document.querySelectorAll(".expense-card");

    previousCards.forEach(card => expensesNode.removeChild(card));
    expenses.forEach(({ name, amount, _id }) => {

        const cardContainer = document.createElement("div"),
            title = document.createElement("p"),
            amountNode = document.createElement("p"),
            deleteBTN = document.createElement("i");

        cardContainer.setAttribute("class", "expense-card");
        title.setAttribute('class', "dark-light-bg large-text white-text");
        amountNode.setAttribute('class', "dark-light-bg large-text white-text");
        title.innerText = titleCase(name);
        amountNode.innerText = usdFormatter(amount);
        deleteBTN.setAttribute("data-id", _id);
        deleteBTN.setAttribute("class", "fa-solid fa-trash-can dark-light-bg large-text");
        deleteBTN.setAttribute("onclick", "deleteExpense(event)");

        setTimeout(() => {
            [title, amountNode, deleteBTN]
                .forEach(node => { cardContainer.appendChild(node); })
            expensesNode.appendChild(cardContainer);
        }, 100);
    });
};

const addExpense = e => {
    e.preventDefault();

    const [budgetNode, billNode, amountNode] = document.querySelectorAll('input'),
        { budget, bills } = getState(),
        _id = genID();

    const expenses = [
        ...bills,
        {
            name: sanitize(billNode.value),
            amount: parseFloat(compose(sanitizeTrolls, sanitize)(amountNode.value)),
            _id
        }
    ];

    const newBudget = parseFloat(budget) - parseFloat(compose(sanitizeTrolls, sanitize)(amountNode.value));
    localStorage.setItem('budget', newBudget);
    localStorage.setItem('bills', JSON.stringify(expenses));
    setState({
        budget: newBudget,
        expenses: compose(mapAmounts, getSum)(expenses),
        bills: expenses
    });

    const balanceNode = document.getElementById("balance"),
        expensesNode = document.getElementById("expenses");

    balanceNode.innerText = usdFormatter(newBudget);
    balanceNode.style.color = newBudget > 0 ? "limegreen" : "red";
    expensesNode.innerText = usdFormatter(compose(mapAmounts, getSum)(expenses));
    budgetNode.value = "";
    billNode.value = "";
    amountNode.value = "";
    appendBills(expenses);
};

document.getElementById('budget').addEventListener('input', e => {

    const { bills } = getState(),
        value = e.target.value,
        balanceNode = document.getElementById('balance'),
        budget = compose(sanitizeTrolls, sanitize, parseFloat)(value) - compose(mapAmounts, getSum, parseFloat)(bills);

    setState({ budget: !value.length ? -bills : budget });
    balanceNode.innerText = usdFormatter(!value.length ? -bills : budget);
    balanceNode.style.color = budget > 0 ? "limegreen" : "red";
    localStorage.setItem("budget", budget);

});

window.onload = function () {
    const budget = localStorage.getItem('budget'),
        bills = localStorage.getItem('bills'),
        balanceNode = document.getElementById("balance");

    if (isNaN(budget)) {
        balanceNode.innerText = usdFormatter("")
        balanceNode.style.color = "red";
        localStorage.setItem("budget", 0)
        setState({ budget: 0 })
    }

    if (budget && !isNaN(budget)) {
        balanceNode.innerText = usdFormatter(budget);
        balanceNode.style.color = budget > 0 ? "limegreen" : "red";
        setState({ budget });
    }

    if (bills) {
        const expensesNode = document.getElementById("expenses"),
            parsed = Array.from(JSON.parse(bills));

        expensesNode.innerText = usdFormatter(compose(mapAmounts, getSum, String)(parsed));
        setState({
            bills: parsed,
            expenses: compose(mapAmounts, getSum)(parsed)
        });
        appendBills(parsed);
    }
};
window.addExpense = addExpense;
window.deleteExpense = deleteExpense
window.appendBills = appendBills;