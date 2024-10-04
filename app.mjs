import useStore from './Store/state.mjs'
const { getState, setState, genID } = useStore

const updateBudget = (e) => {
    setState({ budget: parseFloat(e.target.value) });
}

const appendBill = () => {
console.log('state', getState())
}

const addExpense = (e) => {
    e.preventDefault();
    const [budgetNode, billNode, amountNode] = document.querySelectorAll('input');
    const { budget, bills } = getState();

    let expenses = [
        ...bills,
        {
            name: billNode.value,
            amount: parseFloat(amountNode.value),
            _id: genID()
        }
    ]
        .map(({ amount }) => amount)
        .reduce((a, b) => a + b, 0);


    let newBudget = parseFloat(budget) - parseFloat(expenses);

    setState({
        expenses,
        budget: newBudget,
        bills: [
            ...bills,
            {
                name: billNode.value,
                amount: parseFloat(amountNode.value),
                _id: genID()
            }
        ],
    });

    let balanceNode = document.getElementById("balance")
    let expensesNode = document.getElementById("expenses")
    balanceNode.innerText = newBudget
    expensesNode.innerText = expenses
    budgetNode.value = newBudget;
    billNode.value = ""
    amountNode.value = ""
    appendBill()
}




window.addExpense = addExpense;
window.updateBudget = updateBudget;
window.appendBill = appendBill;