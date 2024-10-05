import useStore from './Store/state.mjs'
const { getState, setState, genID } = useStore
import { compose, getSum, mapAmounts } from "./Utilities/helpers.mjs"

const updateBudget = (e) => {
    setState({ budget: parseFloat(e.target.value) });
}

const appendBills = (expenses = []) => {
    console.log('expenses', expenses)
    console.log(getState())

    let expensesNode = document.getElementById("display-expenses");

    expenses.forEach(({ name, amount, _id }) => {

        let cardContainer = document.createElement("div"),
            title = document.createElement("p"),
            amountNode = document.createElement("p"),
            deleteBTN = document.createElement("button");

        cardContainer.setAttribute("class", "expense-card");
        title.innerText = name;
        amountNode.innerText = amount;
        deleteBTN.setAttribute("data-id", _id);
        deleteBTN.innerText = "Delete";

        let previousCards = document.querySelectorAll(".expense-card")
        if (previousCards.length) {
            previousCards.forEach(card => expensesNode.removeChild(card))
        }
        setTimeout(() => {
            [title, amountNode, deleteBTN]
                .forEach(node => { cardContainer.appendChild(node) })
            expensesNode.appendChild(cardContainer)
        }, 100);

    })
}

const addExpense = (e) => {
    e.preventDefault();

    const [budgetNode, billNode, amountNode] = document.querySelectorAll('input');
    const { budget, bills } = getState();
    const billID = genID();

    let expenses = [
        ...bills,
        {
            name: billNode.value,
            amount: parseFloat(amountNode.value),
            _id: billID
        }
    ];

    let newBudget = parseFloat(budget) - parseFloat(compose(mapAmounts, getSum)(expenses));

    setState({
        expenses: compose(mapAmounts, getSum)(expenses),
        budget: newBudget,
        bills: expenses
    });

    let balanceNode = document.getElementById("balance"),
        expensesNode = document.getElementById("expenses");

    balanceNode.innerText = newBudget;
    expensesNode.innerText = compose(mapAmounts, getSum)(expenses);
    // budgetNode.value = newBudget;
    budgetNode.value = "";
    billNode.value = "";
    amountNode.value = "";
    appendBills(expenses);
}




window.addExpense = addExpense;
window.updateBudget = updateBudget;
window.appendBill = appendBills;