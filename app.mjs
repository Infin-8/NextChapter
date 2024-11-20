import useStore from './Store/store.mjs';
import actions from './Store/Actions/actions.mjs';
const { getState, dispatch } = useStore;
const { setBudget, setExpenses, setBills } = actions
import { compose, getSum, mapAmounts, usdFormatter, titleCase, sanitize, sanitizeTrolls, getColor, genID } from "./Utilities/helpers.mjs";

const deleteExpense = e => {
    e.preventDefault()
    const { bills: _bills, expenses: _expenses, budget: _budget } = getState(),
        [expenseID] = e.target.attributes,
        { value } = expenseID,
        { amount } = _bills.find(({ _id }) => _id == value),
        bills = _bills.filter(({ _id }) => _id != value);

    let budget = parseFloat(_budget) + amount,
        expenses = Math.round(_expenses - amount);

    const balanceNode = document.getElementById("balance");
    balanceNode.innerText = usdFormatter(budget);
    balanceNode.style.color = getColor(budget);
    document.getElementById("expenses").innerText = usdFormatter(expenses);
    localStorage.setItem('bills', JSON.stringify(bills));
    localStorage.setItem("budget", budget);
    [
        setBudget(budget),
        setExpenses(expenses),
        setBills(bills)
    ].forEach(action => dispatch(action));
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
        title.setAttribute('class', "dark-light-bg large-text black-text");
        amountNode.setAttribute('class', "dark-light-bg large-text black-text");
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
            name: compose((str) => str.slice(0, 10), sanitize)(billNode.value),
            amount: compose(sanitizeTrolls, sanitize, parseFloat)(amountNode.value),
            _id
        }
    ];

    const newBudget = parseFloat(budget) - compose(sanitizeTrolls, sanitize, parseFloat)(amountNode.value),
        balanceNode = document.getElementById("balance"),
        expensesNode = document.getElementById("expenses");

    balanceNode.innerText = usdFormatter(newBudget);
    balanceNode.style.color = getColor(newBudget);
    expensesNode.innerText = compose(mapAmounts, getSum, String, usdFormatter)(expenses);
    budgetNode.value = "";
    billNode.value = "";
    amountNode.value = "";
    localStorage.setItem('budget', newBudget);
    localStorage.setItem('bills', JSON.stringify(expenses));
    [
        setBudget(newBudget),
        setExpenses(compose(mapAmounts, getSum)(expenses)),
        setBills(expenses)
    ].forEach(action => dispatch(action));
    appendBills(expenses);
};

document.getElementById('budget').addEventListener('input', e => {

    const { bills } = getState(),
        value = e.target.value,
        balanceNode = document.getElementById('balance'),
        budget = compose(sanitizeTrolls, sanitize, parseFloat)(value) - compose(mapAmounts, getSum, parseFloat)(bills),
        mutable = !value.length ? -bills : budget

    balanceNode.innerText = usdFormatter(mutable);
    balanceNode.style.color = getColor(budget);
    localStorage.setItem("budget", budget);
    compose(setBudget, dispatch)(mutable);
});

window.onload = function () {

    const budget = localStorage.getItem('budget'),
        bills = localStorage.getItem('bills'),
        balanceNode = document.getElementById("balance");

    if (isNaN(budget)) {
        balanceNode.innerText = usdFormatter("")
        balanceNode.style.color = "red";
        localStorage.setItem("budget", 0)
        compose(setBudget, dispatch)(0);
    }

    if (Number(budget)) {
        balanceNode.innerText = usdFormatter(budget);
        balanceNode.style.color = getColor(budget);
        compose(setBudget, dispatch)(budget);
    }

    if (bills) {
        const parsed = compose(JSON.parse, Array.from)(bills)
        document.getElementById("expenses")
            .innerText = compose(
                mapAmounts,
                getSum,
                String,
                usdFormatter
            )(parsed);
        [
            setBills(parsed),
            setExpenses(compose(mapAmounts, getSum)(parsed)),
        ].forEach(action => dispatch(action));
        appendBills(parsed);
    }
};
window.addExpense = addExpense;
window.deleteExpense = deleteExpense;
window.appendBills = appendBills;