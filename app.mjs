import useStore from './Store/state.mjs'
const { getState, setState, genID } = useStore
import { compose, getSum, mapAmounts, usdFormatter, titleCase, sanitize } from "./Utilities/helpers.mjs"

const updateBudget = e => {
    setState({ budget: parseFloat(sanitize(e.target.value)) });
}

function deleteExpense(e) {
    const { bills, expenses, budget } = getState(),
        [expenseID] = e.target.attributes,
        { value } = expenseID,
        { amount } = bills.find(({ _id }) => _id == value),
        removeExpense = bills.filter(({ _id }) => _id != value)

    let newBudget = parseFloat(budget) + amount,
        newExpenses = expenses - amount

    setState({
        budget: newBudget,
        expenses: newExpenses,
        bills: removeExpense
    })


    document.getElementById("expenses").innerText = usdFormatter(newExpenses)
    document.getElementById("balance").innerText = usdFormatter(newBudget)

    appendBills(removeExpense)
}

const appendBills = (expenses = []) => {

    console.log(getState())


    const expensesNode = document.getElementById("display-expenses"),
        previousCards = document.querySelectorAll(".expense-card")
    previousCards.forEach(card => expensesNode.removeChild(card))

    expenses.forEach(({ name, amount, _id }) => {

        const cardContainer = document.createElement("div"),
            title = document.createElement("p"),
            amountNode = document.createElement("p"),
            deleteBTN = document.createElement("button");

        cardContainer.setAttribute("class", "expense-card");
        title.innerText = titleCase(name);
        amountNode.innerText = usdFormatter(amount);
        deleteBTN.setAttribute("data-id", _id);
        deleteBTN.setAttribute("onclick", "deleteExpense(event)")
        deleteBTN.innerText = "Delete";

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
        billID = genID();

    const expenses = [
        ...bills,
        {
            name: sanitize(billNode.value),
            amount: parseFloat(sanitize(amountNode.value)),
            _id: billID
        }
    ];

    const newBudget = parseFloat(budget) - parseFloat(amountNode.value);

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