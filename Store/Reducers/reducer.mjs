import types from "../Constants/types.mjs";

const { SET_BUDGET, SET_EXPENSES, SET_BILLS } = types

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
}

export default reducer