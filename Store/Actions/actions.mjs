import types from "../Constants/types.mjs"

const { SET_BUDGET, SET_EXPENSES, SET_BILLS } = types

const actions = {
    setBudget: payload => ({ type: SET_BUDGET, payload }),
    setExpenses: payload => ({ type: SET_EXPENSES, payload }),
    setBills: payload => ({ type: SET_BILLS, payload }),
}

export default actions